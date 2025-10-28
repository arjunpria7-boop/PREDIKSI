import React from 'react';

interface DisclaimerProps {
  onClearApiKey: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onClearApiKey }) => {
  return (
    <footer className="mt-12 text-center text-xs text-slate-500">
      <p className="max-w-md mx-auto">
        <strong>Peringatan:</strong> Aplikasi ini adalah alat bantu prediksi yang menggunakan AI dan hanya untuk tujuan hiburan. Prediksi tidak dijamin akurat. Kami tidak bertanggung jawab atas kerugian apa pun. Bermainlah dengan bijak dan bertanggung jawab.
      </p>
      <button
        onClick={onClearApiKey}
        className="mt-4 text-slate-400 hover:text-cyan-400 transition-colors underline text-xs bg-transparent border-none cursor-pointer"
      >
        <i className="fa-solid fa-key mr-1"></i>
        Ubah API Key
      </button>
    </footer>
  );
};

export default Disclaimer;
