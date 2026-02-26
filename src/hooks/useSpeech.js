import { useState, useRef, useEffect } from 'react'
import { STT, TTS } from '../utils/STT'

export function useSpeech() {
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcript, setTranscript] = useState('')
  const sttRef = useRef(null)
  const ttsRef = useRef(null)
  const currentUtteranceRef = useRef(null)
  const resultIndexRef = useRef(0) // Track lần cuối đã xử lý để tránh duplicate
  const initializedRef = useRef(false) // Prevent duplicate initialization in strict mode

  // Khởi tạo STT
  useEffect(() => {
    if (initializedRef.current) return // Skip nếu đã initialized

    try {
      sttRef.current = new STT({ lang: 'vi-VN', continuous: true, interim: true })
      console.log('STT initialized successfully')
    } catch (error) {
      console.warn('STT not supported:', error.message)
    }

    initializedRef.current = true
  }, [])

  // Khởi tạo TTS
  useEffect(() => {
    if (initializedRef.current) return // Skip nếu đã initialized

    try {
      ttsRef.current = new TTS({ lang: 'vi-VN', rate: 1, pitch: 1, volume: 1 })
      console.log('TTS initialized successfully')
    } catch (error) {
      console.warn('TTS not supported:', error.message)
    }
  }, [])

  // Bắt đầu ghi âm
  const startListening = () => {
    if (!sttRef.current) {
      console.error('STT not initialized')
      return
    }

    setTranscript('')
    resultIndexRef.current = 0
    
    sttRef.current
      .setLang('vi-VN')
      .setContinuous(true) // Ghi âm liên tục đến khi dừng thủ công
      .setInterim(true)
      .onstart(() => {
        console.log('🎤 Recording started - bấm nút mic lại để dừng')
        setIsListening(true)
      })
      .onend(() => {
        console.log('Recording stopped')
        setIsListening(false)
      })
      .onerror((event) => {
        console.error('STT Error:', event.error)
        setIsListening(false)
      })
      .onresult((event) => {
        let interim = ''
        let final = ''

        // Xử lý tất cả results từ đầu để hiển thị realtime
        for (let i = 0; i < event.results.length; i++) {
          const text = event.results[i][0].transcript

          if (event.results[i].isFinal) {
            final += text + ' '
          } else {
            interim += text
          }
        }

        // Hiển thị realtime: final + interim
        const displayText = final + interim
        if (displayText) {
          setTranscript(displayText)
        }

        // Update resultIndex để lần sau bắt đầu từ đây
        resultIndexRef.current = event.results.length
      })
      .start()
  }

  // Dừng ghi âm
  const stopListening = () => {
    if (sttRef.current) {
      sttRef.current.stop()
      setIsListening(false)
      resultIndexRef.current = 0
    }
  }

  // Xóa transcript
  const clearTranscript = () => {
    setTranscript('')
    resultIndexRef.current = 0
  }

  // Text-to-Speech: Phát âm thanh
  const speak = (text) => {
    if (!text || !window.speechSynthesis) {
      console.warn('TTS not available or no text provided')
      return
    }

    try {
      // Dừng TTS đang phát trước
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.language = 'vi-VN'
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => {
        console.log('🔊 TTS started:', text.substring(0, 50))
        setIsPlaying(true)
      }

      utterance.onend = () => {
        console.log('🔊 TTS ended')
        setIsPlaying(false)
      }

      utterance.onerror = (event) => {
        // Bỏ qua lỗi 'canceled'
        if (event.error !== 'canceled') {
          console.error('❌ TTS Error:', event.error)
        }
        setIsPlaying(false)
      }

      currentUtteranceRef.current = utterance
      setIsPlaying(true)
      
      // Thử speak
      const result = window.speechSynthesis.speak(utterance)
      console.log('TTS speak called, result:', result)
      
      return true
    } catch (error) {
      console.error('❌ Error speaking:', error)
      setIsPlaying(false)
      return false
    }
  }

  // Dừng phát âm thanh
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  return {
    isListening,
    isPlaying,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript
  }
}
