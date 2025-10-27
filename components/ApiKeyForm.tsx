
import React, { useState } from 'react';

interface ApiKeyFormProps {
  onSave: (key: string) => void;
  initialValue?: string;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave, initialValue = '' }) => {
  const [key, setKey] = useState(initialValue);

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        <i className="fa-solid fa-key mr-2 text-emerald-400"></i>
        Atur API Key Gemini Anda
      </h2>
      <p className="text-slate-400 text-center text-sm mb-6 max-w-sm">
        Untuk menggunakan aplikasi, Anda memerlukan Google AI API Key. Key Anda disimpan dengan aman di browser Anda.
      </p>
      <input
        type="password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Masukkan API Key Anda di sini"
        className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center"
        aria-label="API Key Input"
      />
      <button
        onClick={handleSave}
        disabled={!key.trim()}
        className="w-full mt-6 px-10 py-3 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Simpan & Lanjutkan
      </button>
    </div>
  );
};

export default ApiKeyForm;
