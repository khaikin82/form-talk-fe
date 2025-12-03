import { useState, useCallback } from "react" // Thêm useCallback
import { formService } from "../services/formService"

export const useFormData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const createForm = useCallback(async (formUrl) => {
    if (!formUrl.trim()) {
      setError("Please enter a form URL")
      return null
    }

    setLoading(true)
    setError("")

    try {
      const data = await formService.createForm(formUrl)
      console.log("Created form data:", data)
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getForm = useCallback(async (formId) => {
    if (!formId.trim()) {
      setError("Please enter a form ID")
      return null
    }

    setLoading(true)
    setError("")

    try {
      const data = await formService.getFormById(formId)
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const validateAnswer = useCallback(async (questionData, rawAnswer) => {
    try {
      const result = await formService.validateRawAnswer(
        questionData,
        rawAnswer
      )
      return result
    } catch (err) {
      console.error("Validation error:", err)
      // Return valid by default if API fails
      return { isValid: true, followUpQuestion: "" }
    }
  }, [])

  const submitAnswers = useCallback(async (formId, answers, form) => {
    setLoading(true)
    setError("")

    try {
      const data = await formService.submitFormAnswers(formId, answers, form)
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createForm,
    getForm,
    validateAnswer,
    submitAnswers,
    setError,
  }
}
