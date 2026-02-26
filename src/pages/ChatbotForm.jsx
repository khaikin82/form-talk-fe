import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Send, Loader2, Bot, User, Mic, MicOff, MessageSquare, ClipboardList } from "lucide-react"
import { useFormData } from "../hooks/useFormData"
import { useSpeech } from "../hooks/useSpeech"
import { ConversationalChatbot } from "./ConversationalChatbot"

// Form Mode Component - hiện form truyền thống
const FormMode = ({ form, formId }) => {
  const [messages, setMessages] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [selectedOptions, setSelectedOptions] = useState([])
  const [isValidating, setIsValidating] = useState(false)
  const messagesEndRef = useRef(null)
  const { validateAnswer, submitAnswers } = useFormData()
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useSpeech()

  // Initialize messages
  useEffect(() => {
    if (form?.questions && form.questions.length > 0) {
      const greetingMessage = `Chào bạn! 👋 Tôi sẽ hỏi bạn ${form.questions.length} câu hỏi ngắn.`
      setMessages([
        {
          text: greetingMessage,
          isBot: true,
          timestamp: new Date(),
        },
        {
          text: form.questions[0].naturalQuestion,
          isBot: true,
          timestamp: new Date(),
        },
      ])
    }
  }, [form])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
      }, 400)
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "🎉 Hoàn thành! Cảm ơn bạn đã tham gia.",
            isBot: true,
            timestamp: new Date(),
          },
        ])
        setIsCompleted(true)

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

  const handleCheckboxSubmit = () => {
    if (selectedOptions.length > 0) {
      handleAnswer(selectedOptions)
    }
  }

  const toggleCheckbox = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    )
  }

  const currentQuestion = form?.questions[currentQuestionIndex]
  const isInputDisabled = isValidating || isCompleted

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl h-screen md:h-[90vh] md:max-h-[800px] flex flex-col bg-white md:rounded-2xl md:shadow-2xl overflow-hidden">
        {/* Header - Messenger style */}
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">
              {form?.title || "Form Bot"}
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

            {/* Validating indicator */}
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

        {/* Input Area - Messenger style - Hide when completed */}
        {!isInputDisabled && (
          <div className="bg-white border-t px-4 py-3">
            <div>
              {/* Multiple Choice Options */}
              {currentQuestion?.type === "multiple_choice" &&
                currentQuestion.options && (
                  <div className="mb-3 flex flex-wrap gap-2 justify-start">
                    {currentQuestion.options.map(
                      (option, idx) =>
                        option && (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            disabled={isValidating}
                            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-sm font-medium transition-colors border border-blue-200"
                          >
                            {option}
                          </button>
                        )
                    )}
                  </div>
                )}

              {/* Checkbox Options */}
              {currentQuestion?.type === "checkbox" &&
                currentQuestion.options && (
                  <div className="mb-3 space-y-2">
                    {/* Hàng chứa cả options và nút gửi */}
                    <div className="flex justify-between items-start gap-2">
                      {/* Options bên trái */}
                      <div className="flex flex-wrap gap-2">
                        {currentQuestion.options.map(
                          (option, idx) =>
                            option && (
                              <button
                                key={idx}
                                onClick={() => toggleCheckbox(option)}
                                disabled={isValidating}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                                  selectedOptions.includes(option)
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                                }`}
                              >
                                {selectedOptions.includes(option) && "✓ "}
                                {option}
                              </button>
                            )
                        )}
                      </div>

                      {/* Nút gửi bên phải */}
                      {selectedOptions.length > 0 && (
                        <button
                          onClick={handleCheckboxSubmit}
                          disabled={isValidating}
                          className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2 h-fit"
                        >
                          <Send className="w-4 h-4" />
                          Gửi ({selectedOptions.length} đã chọn)
                        </button>
                      )}
                    </div>
                  </div>
                )}

              {/* Text Input */}
              {currentQuestion?.type === "short_answer" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    <input
                      type="text"
                      value={inputValue || transcript}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && !isValidating && handleSendText()
                      }
                      placeholder={isListening ? "Đang ghi âm - bấm nút mic để dừng..." : "Nhập hoặc dùng nút mic..."}
                      disabled={isValidating || isListening}
                      className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 disabled:opacity-50"
                    />
                    
                    {/* Voice Button */}
                    <button
                      onClick={handleVoiceInput}
                      disabled={isValidating}
                      className={`p-2 rounded-full transition-colors ${
                        isListening
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      } disabled:opacity-50`}
                      title={isListening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                    >
                      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    
                    <button
                      onClick={handleSendText}
                      disabled={(!inputValue.trim() && !transcript.trim()) || isValidating || isListening}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Dropdown (behaves like multiple_choice) */}
              {currentQuestion?.type === "dropdown" &&
                currentQuestion.options && (
                  <div className="mb-3 flex flex-wrap gap-2 justify-start">
                    {currentQuestion.options.map(
                      (option, idx) =>
                        option && (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            disabled={isValidating}
                            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-sm font-medium transition-colors border border-blue-200"
                          >
                            {option}
                          </button>
                        )
                    )}
                  </div>
                )}

              {/* Paragraph (long text) */}
              {currentQuestion?.type === "paragraph" && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 bg-white rounded-xl p-3 border border-gray-200">
                    <div className="flex-1 flex flex-col gap-2">
                      <textarea
                        value={inputValue || transcript}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isListening ? "Đang ghi âm - bấm nút mic để dừng..." : "Viết hoặc dùng nút mic..."}
                        rows={4}
                        disabled={isValidating || isListening}
                        className="flex-1 resize-none bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 disabled:opacity-50"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleVoiceInput}
                          disabled={isValidating}
                          className={`px-3 py-2 rounded-full transition-colors text-sm font-medium ${
                            isListening
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          } disabled:opacity-50 flex items-center gap-2`}
                          title={isListening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                        >
                          {isListening ? (
                            <>
                              <MicOff size={16} /> Dừng
                            </>
                          ) : (
                            <>
                              <Mic size={16} /> Ghi âm
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleSendText}
                      disabled={(!inputValue.trim() && !transcript.trim()) || isValidating || isListening}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed h-fit"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Mode Selector Component
const ModeSelector = ({ form, onSelectMode }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl w-full mx-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{form?.title}</h1>
          <p className="text-gray-600">Chọn cách bạn muốn trải nghiệm</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Form Mode */}
          <button
            onClick={() => onSelectMode("form")}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-left hover:scale-105 transform"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Form Có Cấu Trúc</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Trả lời các câu hỏi được xếp hàng có cấu trúc rõ ràng. Tốc độ và dễ dùng.
            </p>
            <div className="text-sm text-gray-500">
              ✓ Nhanh chóng
              <br />✓ Có hướng dẫn
              <br />✓ Câu hỏi cụ thể
            </div>
          </button>

          {/* Option 2: Conversation Mode */}
          <button
            onClick={() => onSelectMode("conversation")}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-left hover:scale-105 transform"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Chat Tự Do</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Hội thoại tự do với AI. Nói bất cứ điều gì bạn muốn, AI sẽ trả lời.
            </p>
            <div className="text-sm text-gray-500">
              ✓ Linh hoạt
              <br />✓ Tự nhiên
              <br />✓ Trả lời bằng voice
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Component
export const ChatbotForm = () => {
  const { formId } = useParams()
  const [form, setForm] = useState(null)
  const [isLoadingForm, setIsLoadingForm] = useState(true)
  const [chatMode, setChatMode] = useState(null) // null = selector, 'form' = form mode, 'conversation' = conversation
  const { getForm } = useFormData()

  useEffect(() => {
    const loadForm = async () => {
      setIsLoadingForm(true)
      const result = await getForm(formId)
      if (result) {
        setForm(result)
      }
      setIsLoadingForm(false)
    }

    loadForm()
  }, [formId, getForm])

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

  // Show mode selector
  if (chatMode === null) {
    return <ModeSelector form={form} onSelectMode={setChatMode} />
  }

  // Show selected mode
  if (chatMode === "form") {
    return <FormMode form={form} formId={formId} />
  }

  if (chatMode === "conversation") {
    return <ConversationalChatbot formId={formId} />
  }
}
