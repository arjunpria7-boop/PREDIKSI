import * as React from 'react';
import { generatePrediction } from '../services/geminiService';
import type { LotteryType, PredictionResult } from '../types';
import ControlPanel from './ControlPanel';
import PredictionDisplay from './PredictionDisplay';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface PredictionGeneratorProps {
    apiKey: string;
    openApiKeyModal: () => void;
}

const PredictionGenerator: React.FC<PredictionGeneratorProps> = ({ apiKey, openApiKeyModal }) => {
    const [lotteryType, setLotteryType] = React.useState<LotteryType>('4D');
    const [market, setMarket] = React.useState<string>('HONGKONG');
    const [prediction, setPrediction] = React.useState<PredictionResult | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [lastResult, setLastResult] = React.useState<string[]>(['', '', '', '']);

    const handleGenerate = React.useCallback(async () => {
        if (!apiKey) {
            setError("API Key belum diatur. Silakan atur kunci di menu pengaturan.");
            openApiKeyModal();
            return;
        }

        setIsLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const result = await generatePrediction(apiKey, lotteryType, market, lastResult);
            setPrediction(result);
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
    }, [apiKey, lotteryType, market, lastResult, openApiKeyModal]);


    return (
        <>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-b-2xl rounded-tr-2xl p-6 shadow-2xl border border-slate-700">
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
        </>
    );
};

export default PredictionGenerator;