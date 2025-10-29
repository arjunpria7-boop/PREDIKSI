
import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onView, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      }).format(date);
  };

  return (
    <div className="mt-8 w-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-bold text-slate-300">
            <i className="fa-solid fa-clock-rotate-left mr-2"></i>
            Riwayat Prediksi
        </h2>
        <button
          onClick={onClear}
          className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-semibold py-1 px-3 rounded-lg text-xs transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Hapus semua riwayat"
        >
          <i className="fa-solid fa-trash-can"></i>
          Hapus
        </button>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-700 max-h-96 overflow-y-auto">
        <ul className="divide-y divide-slate-700">
          {history.map((item, index) => (
            <li key={index} className="flex items-center justify-between p-3 transition-colors hover:bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-bold text-white uppercase">{item.market}</p>
                <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
              </div>
              <button
                onClick={() => onView(item)}
                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label={`Lihat detail prediksi untuk ${item.market}`}
              >
                <i className="fa-solid fa-eye"></i>
                Lihat
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryPanel;
