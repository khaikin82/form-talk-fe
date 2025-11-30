import React, { useState } from 'react';
import { Send } from 'lucide-react';

export const QuestionInput = ({ question, onSubmit, disabled }) => {
  const [answer, setAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = () => {
    if (question.type === 'checkbox') {
      onSubmit(selectedOptions);
      setSelectedOptions([]);
    } else if (question.type === 'multiple_choice') {
      if (answer) {
        onSubmit(answer);
        setAnswer('');
      }
    } else {
      if (answer.trim()) {
        onSubmit(answer);
        setAnswer('');
      }
    }
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  if (question.type === 'multiple_choice' && question.options) {
    return (
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          option && (
            <button
              key={idx}
              onClick={() => {
                setAnswer(option);
                setTimeout(() => onSubmit(option), 100);
              }}
              disabled={disabled}
              className="w-full px-4 py-3 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 rounded-xl text-left transition-all disabled:opacity-50"
            >
              {option}
            </button>
          )
        ))}
      </div>
    );
  }

  if (question.type === 'checkbox' && question.options) {
    return (
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          option && (
            <label
              key={idx}
              className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all"
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                disabled={disabled}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-slate-800">{option}</span>
            </label>
          )
        ))}
        <button
          onClick={handleSubmit}
          disabled={disabled || selectedOptions.length === 0}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Gửi câu trả lời
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !disabled && handleSubmit()}
        placeholder="Nhập câu trả lời..."
        disabled={disabled}
        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:bg-slate-100"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !answer.trim()}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition-all flex items-center gap-2"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
