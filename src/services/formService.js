import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConfig"

export const formService = {
  // Create a new talk form
  createForm: async (formURL, token, style = "normal", customStyleDesc = "") => {
    console.log("abccccc")
    const body = { formURL, style }
    
    // Only include customStyleDesc if style is "custom" and description is provided
    if (style === "custom" && customStyleDesc.trim()) {
      body.customStyleDesc = customStyleDesc
    }
    console.log("Creating form with body:", body)
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CREATE_FORM}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to create form")
    }

    return data
  },

  // Get form by ID with questions
  getFormById: async (formId) => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.GET_FORM(formId)}`
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch form")
    }

    return data
  },

  // Submit form answers - Format for backend API
  submitFormAnswers: async (formId, answers, form) => {
    console.log("Submitting answers:", { formId, answers })

    // Transform answers to match backend AnswerExtractionInput format
    const transformedAnswers = answers.map((ans) => {
      // Find the corresponding question from form to get all details
      const question = form.questions.find((q) => q.id === ans.questionId)
      // Convert answer to rawAnswer string
      let rawAnswer = ""
      if (Array.isArray(ans.answer)) {
        rawAnswer = ans.answer.join(", ")
      } else {
        rawAnswer = String(ans.answer)
      }
      console.log("Raw answer string:", rawAnswer)
      return {
        questionId: ans.questionId,
        originalQuestion: question?.originalQuestion || ans.question,
        questionType: ans.type,
        options: question?.options || [],
        rawAnswer: rawAnswer,
      }
    })

    console.log("Transformed Answers:", transformedAnswers)

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.EXTRACT_ANSWERS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: transformedAnswers,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit answers")
    }

    // Optional: Store in localStorage as backup
    try {
      const submissions = JSON.parse(
        localStorage.getItem("formSubmissions") || "[]"
      )
      const submission = {
        formId,
        answers: transformedAnswers,
        extractedAnswers: data.answers,
        submittedAt: new Date().toISOString(),
      }
      submissions.push(submission)
      localStorage.setItem("formSubmissions", JSON.stringify(submissions))
    } catch (e) {
      console.warn("Failed to store in localStorage:", e)
    }

    return data
  },

  validateRawAnswer: async (questionData, rawAnswer) => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.VALIDATE_ANSWER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: questionData.id,
          originalQuestion: questionData.originalQuestion,
          questionType: questionData.type,
          options: questionData.options || [],
          rawAnswer: rawAnswer,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to validate answer")
    }

    return data.validationResult // { isValid, followUpQuestion }
  },

  // Get user's forms
  getMyForms: async (token) => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.GET_MY_FORMS}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch forms")
    }

    return data
  },
}
