// FIX: Import React to provide types for React.FC, hooks, and JSX.
import React from 'react';
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
  const [market, setMarket] = React.useState<string>('HONGKONG');
  const [prediction, setPrediction] = React.useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastResult, setLastResult] = React.useState<string[]>(['', '', '', '']);
  
  const [predictionHistory, setPredictionHistory] = React.useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = React.useState<HistoryItem | null>(null);
  const [apiKey, setApiKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const storedApiKey = localStorage.getItem('gemini_api_key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }

      const storedHistory = localStorage.getItem('predictionHistory');
      if (storedHistory) {
        setPredictionHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
        localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
    } catch (e) {
        console.error("Failed to save history to localStorage", e);
    }
  }, [predictionHistory]);

  const handleSaveApiKey = (key: string) => {
    try {
      localStorage.setItem('gemini_api_key', key);
      setApiKey(key);
    } catch (e) {
      console.error("Failed to save API key to localStorage", e);
      setError("Gagal menyimpan API Key. Penyimpanan lokal mungkin penuh atau tidak didukung.");
    }
  };
  
  const handleClearApiKey = () => {
    try {
      localStorage.removeItem('gemini_api_key');
      setApiKey(null);
    } catch (e) {
      console.error("Failed to clear API key from localStorage", e);
    }
  };
  
  const handleManageApiKey = () => {
    const key = window.prompt("Masukkan Google AI API Key Anda. Kosongkan untuk menghapus key yang ada.");
    if (key !== null) { // User didn't click cancel
        if (key.trim() === '') {
            handleClearApiKey();
        } else {
            handleSaveApiKey(key.trim());
        }
    }
  };

  const handleGenerate = React.useCallback(async () => {
    if (!apiKey) {
      setError('API Key tidak ditemukan. Silakan atur melalui ikon kunci di bawah.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const result = await generatePrediction('4D', market, lastResult, apiKey);
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
  }, [market, lastResult, apiKey]);

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
              isApiKeySet={!!apiKey}
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
        <Disclaimer onManageApiKey={handleManageApiKey} isApiKeySet={!!apiKey} />
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