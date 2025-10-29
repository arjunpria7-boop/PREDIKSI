import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import PredictionGenerator from './components/PredictionGenerator';
import Modal from './components/Modal';
import ApiKeyForm from './components/ApiKeyForm';

const App: React.FC = () => {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // Jika tidak ada key, buka modal secara otomatis saat pertama kali
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
    setIsApiKeyModalOpen(false);
  };

  const openApiKeyModal = () => setIsApiKeyModalOpen(true);

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header onOpenApiKeyModal={openApiKeyModal} />
        <main className="mt-8">
          <PredictionGenerator apiKey={apiKey} openApiKeyModal={openApiKeyModal} />
        </main>
        <Disclaimer />
      </div>

      <Modal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)}>
        <ApiKeyForm
            currentKey={apiKey}
            onSave={handleSaveApiKey}
            onCancel={() => setIsApiKeyModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default App;