import { useState, useCallback } from 'react'; // Thêm useCallback
import { formService } from '../services/formService';

export const useFormData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createForm = useCallback(async (formUrl) => {
    if (!formUrl.trim()) {
      setError('Please enter a form URL');
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const data = await formService.createForm(formUrl);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getForm = useCallback(async (formId) => {
    if (!formId.trim()) {
      setError('Please enter a form ID');
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const data = await formService.getFormById(formId);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswers = useCallback(async (formId, answers) => {
    setLoading(true);
    setError('');

    try {
      const data = await formService.submitFormAnswers(formId, answers);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createForm,
    getForm,
    submitAnswers,
    setError,
  };
};