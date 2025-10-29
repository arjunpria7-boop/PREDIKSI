import React, { useState } from 'react';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import PredictionGenerator from './components/PredictionGenerator';
import DreamInterpreter from './components/DreamInterpreter';

type ActiveTab = 'prediction' | 'dream';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('prediction');

  const TabButton: React.FC<{
    tabName: ActiveTab;
    currentTab: ActiveTab;
    onClick: (tab: ActiveTab) => void;
    icon: string;
    label: string;
  }> = ({ tabName, currentTab, onClick, icon, label }) => (
    <button
      onClick={() => onClick(tabName)}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400 ${
        currentTab === tabName
          ? 'bg-slate-800/50 text-emerald-400 border-b-2 border-emerald-400'
          : 'bg-slate-800/20 text-slate-400 hover:bg-slate-700/50 hover:text-white'
      }`}
      role="tab"
      aria-selected={currentTab === tabName}
    >
      <i className={`fa-solid ${icon}`}></i>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="flex mb-[-1px] z-10 relative" role="tablist">
             <TabButton 
                tabName="prediction"
                currentTab={activeTab}
                onClick={setActiveTab}
                icon="fa-calculator"
                label="Prediksi Angka"
             />
             <TabButton 
                tabName="dream"
                currentTab={activeTab}
                onClick={setActiveTab}
                icon="fa-moon"
                label="Tafsir Mimpi"
             />
          </div>
            
          {activeTab === 'prediction' && <PredictionGenerator />}
          {activeTab === 'dream' && <DreamInterpreter />}
        </main>
        <Disclaimer />
      </div>
    </div>
  );
};

export default App;