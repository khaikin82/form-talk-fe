export const API_BASE_URL = "http://localhost:9002"

export const API_ENDPOINTS = {
  GET_FORM: (id) => `/forms/${id}`,
  VALIDATE_ANSWER: "/answers/validate",
  CREATE_FORM: "/forms/create",
  EXTRACT_ANSWERS: "/answers/submit",
}
