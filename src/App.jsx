import React from 'react';
import { Dashboard } from './pages/Dashboard';
import { ChatbotForm } from './pages/ChatbotForm';

function App() {
  // Simple routing based on URL path
  const path = window.location.pathname;
  const formIdMatch = path.match(/\/chat\/([a-f0-9-]+)/);
  
  if (formIdMatch) {
    return <ChatbotForm formId={formIdMatch[1]} />;
  }
  
  return <Dashboard />;
}

export default App;