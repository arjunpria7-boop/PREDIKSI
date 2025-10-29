import React, { useState } from 'react';

interface ApiKeyFormProps {
    currentKey: string;
    onSave: (key: string) => void;
    onCancel: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ currentKey, onSave, onCancel }) => {
    const [apiKey, setApiKey] = useState(currentKey);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(apiKey);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                <i className="fa-solid fa-key mr-2"></i>
                Atur API Key
            </h2>
            <p className="text-slate-400 text-center text-sm mb-6">
                API Key Anda disimpan dengan aman di browser Anda dan tidak pernah dikirim ke server kami.
            </p>
            <div className="mb-4">
                <label htmlFor="apiKey" className="block text-slate-300 text-sm font-bold mb-2">
                    Gemini API Key
                </label>
                <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="Masukkan API Key Anda di sini"
                    required
                />
            </div>
            <div className="flex items-center justify-end gap-4 mt-8">
                 <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg shadow-md hover:from-emerald-600 hover:to-cyan-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
};

export default ApiKeyForm;
