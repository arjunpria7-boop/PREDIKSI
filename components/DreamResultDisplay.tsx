import React from 'react';
import type { DreamResult } from '../types';

const NumberGrid: React.FC<{ numbers: string[] }> = ({ numbers }) => (
  <div className="flex flex-wrap justify-center gap-2">
    {numbers.map((num, index) => (
      <span key={index} className="bg-slate-900 text-white font-semibold px-3 py-1 rounded-md text-base">
        {num}
      </span>
    ))}
  </div>
);

interface DreamResultDisplayProps {
  result: DreamResult;
}

const DreamResultDisplay: React.FC<DreamResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700 animate-fade-in space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 text-center">
          <i className="fa-solid fa-lightbulb mr-2"></i>
          Interpretasi Mimpi
        </h3>
        <p className="text-slate-300 text-center leading-relaxed bg-slate-700/50 p-4 rounded-lg">
          {result.interpretation}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
           <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">Angka 4D</h3>
           <NumberGrid numbers={result.numbers_4d} />
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
           <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">Angka 3D</h3>
           <NumberGrid numbers={result.numbers_3d} />
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
           <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">Angka 2D</h3>
           <NumberGrid numbers={result.numbers_2d} />
        </div>
      </div>

       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DreamResultDisplay;
