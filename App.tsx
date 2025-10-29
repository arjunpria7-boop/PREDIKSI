import React, { useState, useCallback } from 'react';
import { generatePrediction } from './services/geminiService';
import type { LotteryType, PredictionResult } from './types';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import PredictionDisplay from './components/PredictionDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Disclaimer from './components/Disclaimer';
import Modal from './components/Modal';
import ApiKeyForm from './components/ApiKeyForm';


const App: React.FC = () => {
  const [lotteryType, setLotteryType] = useState<LotteryType>('4D');
  const [market, setMarket] = useState<string>('HONGKONG');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string[]>(['', '', '', '']);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await generatePrediction(lotteryType, market, lastResult);
      setPrediction(result);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        if (err.message === "API_KEY_NOT_SET") {
          setError('API Key belum diatur. Silakan masukkan API Key Anda.');
          setIsApiKeyModalOpen(true);
        } else if (err.message === "INVALID_API_KEY") {
          setError('API Key tidak valid. Periksa kembali API Key Anda.');
          setIsApiKeyModalOpen(true);
        } else {
          setError('Gagal menghasilkan prediksi. Mungkin ada masalah dengan koneksi atau API. Silakan coba lagi nanti.');
        }
      } else {
         setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [lotteryType, market, lastResult]);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setIsApiKeyModalOpen(false);
    setError(null); // Clear error after saving
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />
        <main className="mt-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
            <ControlPanel
              market={market}
              setMarket={setMarket}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              lastResult={lastResult}
              onLastResultChange={setLastResult}
            />
          </div>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {prediction && !isLoading && <PredictionDisplay result={prediction} market={market} />}
          </div>
        </main>
        <Disclaimer />
      </div>

      <Modal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)}>
        <ApiKeyForm 
            onSave={handleSaveApiKey} 
            onCancel={() => setIsApiKeyModalOpen(false)}
            currentKey={localStorage.getItem('gemini_api_key') || ''}
        />
      </Modal>
    </div>
  );
};

export default App;
