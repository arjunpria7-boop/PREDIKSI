import * as React from 'react';
import InstallPWA from './InstallPWA';

interface HeaderProps {
  onOpenApiKeyModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenApiKeyModal }) => {
  return (
    <header className="relative text-center flex flex-col items-center">
       <button 
        onClick={onOpenApiKeyModal}
        className="absolute top-0 right-0 text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-2xl"
        aria-label="Atur API Key"
        title="Atur API Key"
       >
        <i className="fa-solid fa-gear"></i>
      </button>

      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 py-2">
        <i className="fa-solid fa-brain mr-3"></i>
        Rumus Mas ARJ
      </h1>
      <p className="text-slate-400 mt-2 text-lg">Analisis Cerdas untuk Angka Keberuntungan Anda</p>
      <InstallPWA />
    </header>
  );
};

export default Header;