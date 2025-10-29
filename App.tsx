import * as React from 'react';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import PredictionGenerator from './components/PredictionGenerator';
import DreamInterpreter from './components/DreamInterpreter';
import Modal from './components/Modal';
import ApiKeyForm from './components/ApiKeyForm';

type Tab = 'prediksi' | 'mimpi';

const App: React.FC = () => {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<Tab>('prediksi');

  React.useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
    setIsApiKeyModalOpen(false);
  };

  const openApiKeyModal = () => setIsApiKeyModalOpen(true);

  const TabButton: React.FC<{tab: Tab, label: string, icon: string}> = ({tab, label, icon}) => (
     <button
        onClick={() => setActiveTab(tab)}
        className={`w-1/2 py-4 px-1 text-center font-bold text-lg border-b-4 transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === tab 
            ? 'border-emerald-400 text-white' 
            : 'border-transparent text-slate-400 hover:text-slate-200'
        }`}
        aria-selected={activeTab === tab}
        role="tab"
      >
        <i className={`fa-solid ${icon}`}></i>
        <span>{label}</span>
      </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header onOpenApiKeyModal={openApiKeyModal} />
        <main className="mt-8">
            <div className="bg-slate-800 rounded-t-2xl flex border-b-2 border-slate-700" role="tablist">
                <TabButton tab="prediksi" label="Prediksi Angka" icon="fa-bolt" />
                <TabButton tab="mimpi" label="Tafsir Mimpi" icon="fa-moon" />
            </div>

            <div className="relative">
                <div role="tabpanel" hidden={activeTab !== 'prediksi'}>
                    <PredictionGenerator apiKey={apiKey} openApiKeyModal={openApiKeyModal} />
                </div>
                 <div role="tabpanel" hidden={activeTab !== 'mimpi'}>
                    <DreamInterpreter apiKey={apiKey} openApiKeyModal={openApiKeyModal} />
                </div>
            </div>
        </main>
        <Disclaimer />
      </div>

      <Modal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)}>
        <ApiKeyForm
            currentKey={apiKey}
            onSave={handleSaveApiKey}
            onCancel={() => setIsApiKeyModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default App;