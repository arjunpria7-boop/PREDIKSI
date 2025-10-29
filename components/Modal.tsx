
import React, { useEffect } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 relative animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 w-8 h-8 flex items-center justify-center"
          aria-label="Tutup modal"
        >
          <i className="fa-solid fa-xmark fa-2x"></i>
        </button>
        <div className="p-2 sm:p-4 md:p-6">
            {children}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slide-in-up {
            from { transform: translateY(20px) scale(0.98); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
        .animate-slide-in-up {
            animation: slide-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;
