// ==========================================
// src/pages/ChatbotForm.jsx - REPLACE ENTIRE FILE
// ==========================================
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, CheckCircle2, Bot, User } from 'lucide-react';
import { useFormData } from '../hooks/useFormData';

export const ChatbotForm = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const messagesEndRef = useRef(null);
  const { getForm, submitAnswers } = useFormData();

  useEffect(() => {
    const loadForm = async () => {
      setIsLoadingForm(true);
      const result = await getForm(formId);
      if (result && result.questions) {
        setForm(result);
        setMessages([
          {
            text: `Chào bạn! 👋 Tôi sẽ hỏi bạn ${result.questions.length} câu hỏi ngắn.`,
            isBot: true,
            timestamp: new Date()
          },
          {
            text: result.questions[0].naturalQuestion,
            isBot: true,
            timestamp: new Date()
          }
        ]);
      }
      setIsLoadingForm(false);
    };
    
    loadForm();
  }, [formId, getForm]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAnswer = async (answer) => {
    const currentQuestion = form.questions[currentQuestionIndex];
    const answerText = Array.isArray(answer) ? answer.join(', ') : answer;
    
    // Add user message
    setMessages(prev => [...prev, { 
      text: answerText, 
      isBot: false,
      timestamp: new Date()
    }]);

    // Store answer
    const newAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.originalQuestion,
      answer: answer,
      type: currentQuestion.type,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Clear inputs
    setInputValue('');
    setSelectedOptions([]);

    // Move to next question or complete
    if (currentQuestionIndex < form.questions.length - 1) {
      // Show next question immediately
      const nextQuestion = form.questions[currentQuestionIndex + 1];
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: nextQuestion.naturalQuestion, 
          isBot: true,
          timestamp: new Date()
        }]);
      }, 400);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question - show success immediately
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: '🎉 Hoàn thành! Cảm ơn bạn đã tham gia.', 
          isBot: true,
          timestamp: new Date()
        }]);
        setIsCompleted(true);
        
        // Submit in background (không cần await)
        submitAnswers(formId, updatedAnswers, form).then(result => {
          console.log('Form submitted:', result);
        }).catch(err => {
          console.error('Submit error:', err);
        });
      }, 400);
    }
  };

  const handleSendText = () => {
    if (inputValue.trim()) {
      handleAnswer(inputValue);
    }
  };

  const handleCheckboxSubmit = () => {
    if (selectedOptions.length > 0) {
      handleAnswer(selectedOptions);
    }
  };

  const toggleCheckbox = (option) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  if (isLoadingForm) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl">
          <p className="text-red-600 font-medium">Không tìm thấy form!</p>
        </div>
      </div>
    );
  }

  const currentQuestion = form?.questions[currentQuestionIndex];

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl h-screen md:h-[90vh] md:max-h-[800px] flex flex-col bg-white md:rounded-2xl md:shadow-2xl overflow-hidden">
        {/* Header - Messenger style */}
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">{form?.title || 'Form Bot'}</h1>
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

        {/* Messages Area - Messenger style */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
          <div className="space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
            >
              {msg.isBot && (
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md ${msg.isBot ? '' : 'flex flex-col items-end'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    msg.isBot
                      ? 'bg-gray-200 text-gray-900 rounded-tl-none'
                      : 'bg-blue-500 text-white rounded-tr-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1 px-2">
                  {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {!msg.isBot && (
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Messenger style - Hide when completed */}
      {!isCompleted && (
        <div className="bg-white border-t px-4 py-3">
          <div>
            {/* Multiple Choice Options */}
            {currentQuestion?.type === 'multiple_choice' && currentQuestion.options && (
              <div className="mb-3 flex flex-wrap gap-2 justify-start">
                {currentQuestion.options.map((option, idx) => (
                  option && (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-sm font-medium transition-colors border border-blue-200"
                    >
                      {option}
                    </button>
                  )
                ))}
              </div>
            )}

            {/* Checkbox Options */}
{currentQuestion?.type === 'checkbox' && currentQuestion.options && (
  <div className="mb-3 space-y-2">

    {/* Hàng chứa cả options và nút gửi */}
    <div className="flex justify-between items-start gap-2">

      {/* Options bên trái */}
      <div className="flex flex-wrap gap-2">
        {currentQuestion.options.map((option, idx) => (
          option && (
            <button
              key={idx}
              onClick={() => toggleCheckbox(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedOptions.includes(option)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {selectedOptions.includes(option) && '✓ '}
              {option}
            </button>
          )
        ))}
      </div>

      {/* Nút gửi bên phải */}
      {selectedOptions.length > 0 && (
        <button
          onClick={handleCheckboxSubmit}
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
            {currentQuestion?.type === 'short_answer' && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="Nhập câu trả lời..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
                />
                <button
                  onClick={handleSendText}
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};


// ==========================================
// OPTIONAL: Delete these old files (not needed anymore)
// ==========================================
// src/components/chatbot/ChatMessage.jsx - CÓ THỂ XÓA
// src/components/chatbot/QuestionInput.jsx - CÓ THỂ XÓA