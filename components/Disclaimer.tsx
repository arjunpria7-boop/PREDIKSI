// FIX: Import React to provide types for React.FC and JSX.
import React from 'react';

interface DisclaimerProps {
  onManageApiKey: () => void;
  isApiKeySet: boolean;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onManageApiKey, isApiKeySet }) => {
  return (
    <footer className="mt-12 text-center text-xs text-slate-500">
      <p className="max-w-md mx-auto">
        <strong>Peringatan:</strong> Aplikasi ini adalah alat bantu prediksi yang menggunakan AI dan hanya untuk tujuan hiburan. Prediksi tidak dijamin akurat. Kami tidak bertanggung jawab atas kerugian apa pun. Bermainlah dengan bijak dan bertanggung jawab.
      </p>
      <div className="mt-4">
        <button
          onClick={onManageApiKey}
          title={isApiKeySet ? "Ubah API Key" : "Masukkan API Key"}
          className={`transition-all duration-300 text-lg p-2 h-10 w-10 rounded-full flex items-center justify-center mx-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            isApiKeySet
              ? 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-cyan-400'
              : 'bg-cyan-500/20 text-cyan-400 animate-pulse hover:bg-cyan-500/40 focus:ring-cyan-400'
          }`}
        >
          <i className="fa-solid fa-key"></i>
        </button>
      </div>
    </footer>
  );
};

export default Disclaimer;