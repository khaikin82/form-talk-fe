export const API_BASE_URL = "http://localhost:9002"

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  
  // Forms
  GET_FORM: (id) => `/forms/${id}`,
  GET_MY_FORMS: "/forms/my",
  CREATE_FORM: "/forms/create",
  
  // Answers
  VALIDATE_ANSWER: "/answers/validate",
  EXTRACT_ANSWERS: "/answers/submit",
}
