import { GoogleGenAI, Type } from "@google/genai";
import type { LotteryType, PredictionResult } from '../types';

// According to guidelines, API key must be from process.env.API_KEY
// The exclamation mark asserts that the value is not null or undefined.
// This is safe assuming the environment is set up as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Schema for the JSON response from the Gemini API.
const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    ai: { type: Type.STRING, description: 'Angka Ikut: 2-4 digit angka yang kemungkinan besar akan muncul.' },
    cb: { type: Type.STRING, description: 'Colok Bebas: 1 atau 2 digit angka yang diprediksi akan muncul di posisi mana saja.' },
    cn: { type: Type.STRING, description: 'Colok Naga: 3 digit angka yang diprediksi akan muncul di posisi mana saja.' },
    bbfs: { type: Type.STRING, description: 'Bolak Balik Full Set: 5-7 digit angka untuk kombinasi.' },
    bb4d: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 set angka 4D bolak-balik. Setiap angka harus 4 digit.'
    },
    bb3d: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '5 set angka 3D bolak-balik. Setiap angka harus 3 digit.'
    },
    bb2d: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '5 set angka 2D. Setiap angka harus 2 digit.'
    },
    bb2dCadangan: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 set angka 2D cadangan. Setiap angka harus 2 digit.'
    },
  },
  // All properties are required to ensure a complete prediction object.
  required: ['ai', 'cb', 'cn', 'bbfs', 'bb4d', 'bb3d', 'bb2d', 'bb2dCadangan']
};

/**
 * Generates a lottery prediction using the Gemini API.
 * @param lotteryType - The type of lottery (e.g., '4D').
 * @param market - The lottery market (e.g., 'HONGKONG').
 * @param lastResult - An array of the last 4 digits.
 * @returns A promise that resolves to a PredictionResult object.
 */
export const generatePrediction = async (
  lotteryType: LotteryType,
  market: string,
  lastResult: string[]
): Promise<PredictionResult> => {
  const lastResultString = lastResult.join('');

  const prompt = `Anda adalah seorang ahli numerologi dan ahli prediksi togel yang sangat berpengalaman bernama "Mas ARJ". Anda menganalisis data untuk memberikan prediksi angka keberuntungan.

Tugas Anda adalah membuat prediksi untuk togel ${lotteryType}.

Informasi yang diberikan:
1. Pasaran: ${market}
2. Hasil 4D terakhir: ${lastResultString || "Tidak ada"}

Instruksi:
- Berdasarkan informasi di atas dan pengetahuan Anda tentang pola angka, buatlah satu set prediksi lengkap.
- Angka-angka harus terasa acak dan tidak mengikuti pola yang jelas.
- Pastikan semua kategori prediksi terisi sesuai format yang diminta:
  - ai: 2-4 digit
  - cb: 1-2 digit
  - cn: 3 digit
  - bbfs: 5-7 digit
  - bb4d: 4 set, masing-masing 4 digit
  - bb3d: 5 set, masing-masing 3 digit
  - bb2d: 5 set, masing-masing 2 digit
  - bb2dCadangan: 2 set, masing-masing 2 digit
- Kembalikan hasil HANYA dalam format JSON yang valid sesuai dengan skema yang diberikan. JANGAN tambahkan markdown (e.g. \`\`\`json ... \`\`\`).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using a powerful model for better reasoning and pattern recognition.
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: predictionSchema,
        temperature: 1, // Higher temperature for more "creative" and less deterministic number generation.
      },
    });

    // The response is expected to be a clean JSON string due to responseMimeType and responseSchema.
    const textResponse = response.text;
    const jsonResult = JSON.parse(textResponse);

    return jsonResult as PredictionResult;

  } catch (error) {
    console.error("Error generating prediction from Gemini:", error);
    // Propagate a user-friendly error to be handled by the UI.
    throw new Error("Failed to get prediction from AI service.");
  }
};
