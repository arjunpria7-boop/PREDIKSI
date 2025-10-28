import React, { useState } from 'react';

interface ApiKeyFormProps {
  onSave: (apiKey: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() === '') {
      setError('API Key tidak boleh kosong.');
      return;
    }
    setError('');
    onSave(apiKey.trim());
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-700 text-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            <i className="fa-solid fa-key mr-2"></i>
            Masukkan API Key
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Anda memerlukan Gemini API Key untuk menggunakan aplikasi ini. Kunci Anda disimpan dengan aman di browser Anda.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Masukkan Google AI API Key Anda"
              className="w-full bg-slate-700/80 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center"
              aria-label="API Key Input"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-10 py-3 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
            >
              <i className="fa-solid fa-save"></i>
              Simpan & Lanjutkan
            </button>
          </form>
           <p className="text-slate-500 text-xs mt-6">
            Tidak punya API Key? Dapatkan dari{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Google AI Studio
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyForm;
