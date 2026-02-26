import React, { useState, useEffect, useRef } from "react"
import { Send, Loader2, Bot, User, Mic, MicOff } from "lucide-react"
import { useFormData } from "../hooks/useFormData"
import { useSpeech } from "../hooks/useSpeech"

export const ConversationalChatbot = ({ formId }) => {
  const [form, setForm] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [selectedOptions, setSelectedOptions] = useState([])
  const [isValidating, setIsValidating] = useState(false)
  const [isLoadingForm, setIsLoadingForm] = useState(true)
  const messagesEndRef = useRef(null)
  const initializedRef = useRef(false)
  const speechStartTimeRef = useRef(null)
  const { getForm, validateAnswer, submitAnswers } = useFormData()
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useSpeech()

  // Load form data
  useEffect(() => {
    // Prevent double initialization in Strict Mode
    if (initializedRef.current) return
    initializedRef.current = true

    const loadForm = async () => {
      setIsLoadingForm(true)
      const result = await getForm(formId)
      if (result) {
        setForm(result)
        // Initialize with greeting and first question
        const greetingMessage = `Chào bạn! 👋 Tôi sẽ hỏi bạn ${result.questions.length} câu hỏi ngắn.`
        setMessages([
          {
            text: greetingMessage,
            isBot: true,
            timestamp: new Date(),
          },
          {
            text: result.questions[0].naturalQuestion,
            isBot: true,
            timestamp: new Date(),
          },
        ])
        // Speak only the first question (not the greeting)
        speakQuestion(result.questions[0].naturalQuestion)
        // Let speakQuestion handle microphone timing (don't auto-start here)
      }
      setIsLoadingForm(false)
    }

    loadForm()
  }, [formId, getForm])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Text-to-Speech function with microphone control
  const speakQuestion = (questionText) => {
    try {
      // Check if Speech Synthesis is supported
      if (!('speechSynthesis' in window)) {
        console.warn('Speech Synthesis not supported in this browser')
        return
      }

      // Stop listening while bot is speaking (prevent echo)
      stopListening()

      // Pause any ongoing speech first
      if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }

      // Create utterance with Vietnamese text
      const utterance = new SpeechSynthesisUtterance(questionText)
      utterance.lang = 'vi-VN'
      utterance.rate = 1.2
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Add event handlers
      utterance.onstart = () => {
        console.log('Speech started:', questionText)
        // Record when speech actually starts
        speechStartTimeRef.current = Date.now()
      }

      utterance.onend = () => {
        console.log('Speech ended')
        // Resume listening after 2.5 seconds from when speech started
        const elapsedTime = Date.now() - (speechStartTimeRef.current || Date.now())
        const remainingDelay = Math.max(2500 - elapsedTime, 100)
        
        setTimeout(() => {
          startListening()
        }, remainingDelay)
      }

      utterance.onerror = (event) => {
        // Ignore 'canceled' error, it's normal when pausing/resuming
        if (event.error !== 'canceled') {
          console.error('Speech synthesis error:', event.error)
        }
        // Resume listening on error too
        const elapsedTime = Date.now() - (speechStartTimeRef.current || Date.now())
        const remainingDelay = Math.max(2500 - elapsedTime, 100)
        
        setTimeout(() => {
          startListening()
        }, remainingDelay)
      }

      // Speak the text
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Error in speakQuestion:', error)
    }
  }

  const handleAnswer = async (answer) => {
    const currentQuestion = form.questions[currentQuestionIndex]
    const answerText = Array.isArray(answer) ? answer.join(", ") : answer

    setMessages((prev) => [
      ...prev,
      {
        text: answerText,
        isBot: false,
        timestamp: new Date(),
      },
    ])

    setInputValue("")
    setSelectedOptions([])
    clearTranscript()

    setIsValidating(true)
    const validation = await validateAnswer(currentQuestion, answerText)
    setIsValidating(false)

    if (!validation.isValid && validation.followUpQuestion) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: validation.followUpQuestion,
            isBot: true,
            timestamp: new Date(),
          },
        ])
        // Speak follow-up question
        speakQuestion(validation.followUpQuestion)
      }, 400)
      return
    }

    const newAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.originalQuestion,
      answer: answer,
      type: currentQuestion.type,
    }
    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    if (currentQuestionIndex < form.questions.length - 1) {
      const nextQuestion = form.questions[currentQuestionIndex + 1]
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: nextQuestion.naturalQuestion,
            isBot: true,
            timestamp: new Date(),
          },
        ])
        // Speak next question
        speakQuestion(nextQuestion.naturalQuestion)
      }, 400)
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setTimeout(() => {
        const completionMessage = "🎉 Hoàn thành! Cảm ơn bạn đã tham gia."
        setMessages((prev) => [
          ...prev,
          {
            text: completionMessage,
            isBot: true,
            timestamp: new Date(),
          },
        ])
        setIsCompleted(true)
        speakQuestion(completionMessage)

        submitAnswers(formId, updatedAnswers, form)
          .then((result) => {
            console.log("Form submitted:", result)
          })
          .catch((err) => {
            console.error("Submit error:", err)
          })
      }, 400)
    }
  }

  const handleSendText = () => {
    const textToSend = inputValue.trim() || transcript.trim()
    if (textToSend) {
      handleAnswer(textToSend)
    }
  }

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Auto-submit when recording stops and transcript is available (2 second silence)
  useEffect(() => {
    if (!isListening && transcript.trim() && !isValidating && !isCompleted) {
      // Wait 2 seconds of silence before submitting
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          handleAnswer(transcript.trim())
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isListening, transcript, isValidating, isCompleted])

  if (isLoadingForm) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl">
          <p className="text-red-600 font-medium">Không tìm thấy form!</p>
        </div>
      </div>
    )
  }

  const currentQuestion = form?.questions[currentQuestionIndex]
  const isInputDisabled = isValidating || isCompleted

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl h-screen md:h-[90vh] md:max-h-[800px] flex flex-col bg-white md:rounded-2xl md:shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">
              {form?.title || "Chatbot"} (Voice)
            </h1>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Đang hoạt động
            </p>
          </div>
          {!isCompleted && (
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {currentQuestionIndex + 1}/{form?.questions.length}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.isBot ? "justify-start" : "justify-end"
                }`}
              >
                {msg.isBot && (
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md ${
                    msg.isBot ? "" : "flex flex-col items-end"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.isBot
                        ? "bg-gray-200 text-gray-900 rounded-tl-none"
                        : "bg-blue-500 text-white rounded-tr-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-2">
                    {msg.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {!msg.isBot && (
                  <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isValidating && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-200 text-gray-900 rounded-2xl rounded-tl-none px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Đang kiểm tra...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Voice Only */}
        {!isInputDisabled && (
          <div className="bg-white border-t px-4 py-3">
            <div className="flex flex-col items-center gap-4">
              {/* Display Options for Multiple Choice, Checkbox, Dropdown */}
              {(currentQuestion?.type === "multiple_choice" ||
                currentQuestion?.type === "checkbox" ||
                currentQuestion?.type === "dropdown") &&
                currentQuestion.options && (
                  <div className="w-full">
                    <p className="text-xs text-gray-500 mb-2 text-center">
                      Các lựa chọn (nói một trong những tùy chọn dưới):
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {currentQuestion.options.map(
                        (option, idx) =>
                          option && (
                            <div
                              key={idx}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-300"
                            >
                              {option}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Transcript Display */}
              {transcript && (
                <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-600">Đang nói:</span> {transcript}
                  </p>
                </div>
              )}

              {/* Voice Button */}
              <button
                onClick={handleVoiceInput}
                disabled={isValidating}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 text-white scale-110 shadow-lg"
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                } disabled:opacity-50`}
                title={isListening ? "Dừng ghi âm" : "Bấm để nói"}
              >
                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
              </button>

              {/* Status Text */}
              <p className="text-xs text-gray-600 text-center">
                {isValidating ? (
                  "Đang kiểm tra câu trả lời..."
                ) : isListening ? (
                  "🎤 Đang nghe... Bấm nút để dừng"
                ) : (
                  "Bấm nút mic để trả lời"
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
