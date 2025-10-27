import React, { useState, useCallback, useEffect } from 'react';
import { generatePrediction } from './services/geminiService';
import type { PredictionResult, HistoryItem } from './types';
import Header from './Header';
import ControlPanel from './components/ControlPanel';
import PredictionDisplay from './components/PredictionDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Disclaimer from './components/Disclaimer';
import HistoryPanel from './components/HistoryPanel';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [market, setMarket] = useState<string>('HONGKONG');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string[]>(['', '', '', '']);
  
  const [predictionHistory, setPredictionHistory] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('predictionHistory');
      if (storedHistory) {
        setPredictionHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
    } catch (e) {
        console.error("Failed to save history to localStorage", e);
    }
  }, [predictionHistory]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await generatePrediction('4D', market, lastResult);
      setPrediction(result);
      
      const newHistoryItem: HistoryItem = {
        market: market,
        prediction: result,
        date: new Date().toISOString(),
      };
      setPredictionHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 10));

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.';
      setError(`Gagal: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [market, lastResult]);

  const handleViewHistory = (item: HistoryItem) => {
    setSelectedHistory(item);
  };
  
  const handleClearHistory = () => {
      if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat prediksi?")) {
          setPredictionHistory([]);
      }
  };


  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
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
          
          {predictionHistory.length > 0 && (
             <HistoryPanel 
                history={predictionHistory} 
                onView={handleViewHistory}
                onClear={handleClearHistory} 
            />
          )}
        </main>
        <Disclaimer />
      </div>

      {selectedHistory && (
        <Modal onClose={() => setSelectedHistory(null)}>
            <PredictionDisplay result={selectedHistory.prediction} market={selectedHistory.market} />
        </Modal>
      )}
    </div>
  );
};

export default App;