import type { LotteryType, PredictionResult } from '../types';

// WARNING: API Key is hardcoded. This is not a secure practice for production applications.
const API_KEY = "AIzaSyDdVMVSj5ZFGtpm9gJ2GATOp-sjwqIBfA4";

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
  // Dynamically import the SDK only when the function is called.
  // This is the definitive fix to prevent blank screens on deployment.
  const { GoogleGenAI, Type } = await import('@google/genai');
  
  // Initialize the AI client here to prevent crashes on app startup.
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Schema is defined inside the function to prevent top-level module errors
  // during initialization, which can cause a blank screen on deployment.
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
    required: ['ai', 'cb', 'cn', 'bbfs', 'bb4d', 'bb3d', 'bb2d', 'bb2dCadangan']
  };

  const lastResultString = lastResult.join('');

  const prompt = `Anda adalah ahli numerologi "Mas ARJ". Buat prediksi togel ${lotteryType} untuk pasaran ${market}.
Hasil 4D terakhir: ${lastResultString || "Tidak ada"}.
Buat satu set prediksi lengkap (ai, cb, cn, bbfs, bb4d, bb3d, bb2d, bb2dCadangan) dengan angka acak.
WAJIB kembalikan HANYA format JSON valid sesuai skema yang diberikan.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Switched to a faster model for better performance
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: predictionSchema,
        temperature: 0.9, // Slightly reduced for more consistent JSON output
      },
    });

    let textResponse = response.text.trim();
    if (textResponse.startsWith('```json')) {
      textResponse = textResponse.slice(7).trim();
    }
    if (textResponse.endsWith('```')) {
      textResponse = textResponse.slice(0, -3).trim();
    }
    
    try {
      const jsonResult = JSON.parse(textResponse);
      return jsonResult as PredictionResult;
    } catch (parseError) {
      console.error("Failed to parse JSON response from AI:", textResponse, parseError);
      throw new Error("AI memberikan respons dalam format yang tidak valid. Silakan coba lagi.");
    }

  } catch (error) {
    console.error("Error generating prediction from Gemini:", error);
    if (error instanceof Error && error.message.includes('format yang tidak valid')) {
        throw error; // Re-throw the specific parsing error
    }
    throw new Error("Gagal terhubung ke layanan AI. Pastikan API Key valid dan periksa koneksi internet Anda.");
  }
};