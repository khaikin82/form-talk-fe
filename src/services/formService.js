import { API_BASE_URL, API_ENDPOINTS } from '../constants/apiConfig';

export const formService = {
  // Create a new talk form
  createForm: async (formURL) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CREATE_FORM}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formURL }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create form');
    }

    return data;
  },

  // Get form by ID with questions
  getFormById: async (formId) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_FORM(formId)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch form');
    }

    return data;
  },

  // Submit form answers (mock for now)
  submitFormAnswers: async (formId, answers) => {
    // Mock implementation - store in localStorage
    console.log('Submitting answers:', { formId, answers });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in localStorage
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    const submission = {
      formId,
      answers,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(submission);
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    
    return { success: true, submissionId: Date.now().toString() };
  },
};