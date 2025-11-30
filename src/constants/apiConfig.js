export const API_BASE_URL = 'http://localhost:9002';

export const API_ENDPOINTS = {
  GET_FORM: (id) => `/forms/${id}`,
  CREATE_FORM: '/forms/create',
  SUBMIT_FORM: (id) => `/forms/${id}/submit`, // Mock for now
};