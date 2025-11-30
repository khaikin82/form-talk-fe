import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ShareableLink } from '../components/forms/ShareableLink';
import { useFormData } from '../hooks/useFormData';

export const CreateForm = () => {
  const [formUrl, setFormUrl] = useState('');
  const [createdForm, setCreatedForm] = useState(null);
  const { loading, createForm } = useFormData();

  const handleCreate = async () => {
    const result = await createForm(formUrl);
    if (result && result.length > 0) {
      setCreatedForm(result);
      setFormUrl('');
    }
  };

  const getFormId = () => {
    if (!createdForm || createdForm.length === 0) return null;
    return createdForm[0].formId;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <Input
        label="Form URL"
        value={formUrl}
        onChange={(e) => setFormUrl(e.target.value)}
        placeholder="https://example.com/form"
        onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
      />

      <Button
        onClick={handleCreate}
        disabled={loading}
        icon={loading ? Loader2 : Plus}
      >
        {loading ? 'Đang tạo...' : 'Tạo Talk Form'}
      </Button>

      {createdForm && getFormId() && (
        <>
          <ShareableLink formId={getFormId()} />
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-800 font-medium mb-2">
              ✅ Tạo form thành công với {createdForm.length} câu hỏi!
            </p>
            <p className="text-sm text-green-700">
              Form ID: <code className="bg-green-100 px-2 py-1 rounded">{getFormId()}</code>
            </p>
          </div>
        </>
      )}
    </div>
  );
};