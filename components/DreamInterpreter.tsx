import React, { useState, useCallback } from 'react';
import { interpretDream } from '../services/geminiService';
import type { DreamResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DreamResultDisplay from './DreamResultDisplay';

const DreamInterpreter: React.FC = () => {
  const [dream, setDream] = useState('');
  const [result, setResult] = useState<DreamResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInterpret = useCallback(async () => {
    if (!dream.trim()) {
      setError('Harap masukkan deskripsi mimpi Anda.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const dreamResult = await interpretDream(dream);
      setResult(dreamResult);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
         setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [dream]);

  return (
    <div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-b-2xl rounded-tr-2xl p-6 shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-1 text-slate-200">
                Tafsir Mimpi Jadi Angka
            </h2>
            <p className="text-slate-400 text-center text-sm mb-6">
                Ceritakan mimpimu dan biarkan AI mengungkap angka keberuntungan di baliknya.
            </p>
            <div className="flex flex-col items-center gap-6">
                <textarea
                    value={dream}
                    onChange={(e) => setDream(e.target.value)}
                    placeholder="Contoh: Saya bermimpi melihat seekor naga emas terbang di langit..."
                    className="w-full h-28 bg-slate-700/80 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                    aria-label="Deskripsi Mimpi"
                    disabled={isLoading}
                />
                <button
                    onClick={handleInterpret}
                    disabled={isLoading || !dream.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                    <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        Menafsirkan...
                    </>
                    ) : (
                    <>
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        Tafsirkan Mimpi
                    </>
                    )}
                </button>
            </div>
        </div>

        <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {result && !isLoading && <DreamResultDisplay result={result} />}
        </div>
    </div>
  );
};

export default DreamInterpreter;