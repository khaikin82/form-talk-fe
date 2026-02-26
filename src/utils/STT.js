/**
 * Speech-to-Text wrapper class using Web Speech API
 */
export class STT {
  constructor({ lang = 'vi-VN', continuous = true, interim = true } = {}) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) throw new Error('SpeechRecognition not supported')
    
    this.rec = new SR()
    this.rec.lang = lang
    this.rec.continuous = continuous
    this.rec.interimResults = interim
  }

  onstart(fn) {
    this.rec.onstart = fn
    return this
  }

  onend(fn) {
    this.rec.onend = fn
    return this
  }

  onerror(fn) {
    this.rec.onerror = fn
    return this
  }

  onresult(fn) {
    this.rec.onresult = fn
    return this
  }

  start() {
    this.rec.start()
    return this
  }

  stop() {
    this.rec.stop()
    return this
  }

  abort() {
    this.rec.abort()
    return this
  }

  setLang(lang) {
    this.rec.lang = lang
    return this
  }

  setContinuous(v) {
    this.rec.continuous = !!v
    return this
  }

  setInterim(v) {
    this.rec.interimResults = !!v
    return this
  }
}

/**
 * Text-to-Speech wrapper class using Web Speech API
 */
export class TTS {
  constructor({ lang = 'vi-VN', rate = 1, pitch = 1, volume = 1 } = {}) {
    if (!window.speechSynthesis) throw new Error('Text-to-Speech not supported')
    
    this.synth = window.speechSynthesis
    this.lang = lang
    this.rate = rate
    this.pitch = pitch
    this.volume = volume
  }

  speak(text) {
    if (!text) return this

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.language = this.lang
    utterance.rate = this.rate
    utterance.pitch = this.pitch
    utterance.volume = this.volume

    this.synth.speak(utterance)
    return this
  }

  onstart(fn) {
    if (this.currentUtterance) {
      this.currentUtterance.onstart = fn
    }
    return this
  }

  onend(fn) {
    if (this.currentUtterance) {
      this.currentUtterance.onend = fn
    }
    return this
  }

  onerror(fn) {
    if (this.currentUtterance) {
      this.currentUtterance.onerror = fn
    }
    return this
  }

  stop() {
    this.synth.cancel()
    return this
  }

  setLang(lang) {
    this.lang = lang
    return this
  }

  setRate(rate) {
    this.rate = rate
    return this
  }

  setPitch(pitch) {
    this.pitch = pitch
    return this
  }

  setVolume(volume) {
    this.volume = volume
    return this
  }
}
