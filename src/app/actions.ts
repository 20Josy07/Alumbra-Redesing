
'use server';

import { type AnalysisResult } from "@/types";

export type { AnalysisResult };

export async function performAnalysis(text: string): Promise<{ data: AnalysisResult | null; error: string | null }> {
  if (!text || text.trim().length < 20) {
    return { data: null, error: "Por favor, introduce una descripción más detallada (al menos 20 caracteres)." };
  }
  
  try {
    const response = await fetch('https://alumbra-api.up.railway.app/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", errorBody);
      throw new Error(`El servicio de análisis devolvió un error: ${response.statusText}`);
    }

    const result: AnalysisResult = await response.json();
    
    if (!result || !result.score || !result.rules || !result.help) {
        throw new Error('La respuesta del análisis de IA no tiene el formato esperado.');
    }
    
    return { data: result, error: null };

  } catch (e: any) {
    console.error("Error during API analysis:", e);
    
    let errorMessage = "Ocurrió un error inesperado durante el análisis. Por favor, inténtalo más tarde.";
    if (e.message) {
        if (e.message.includes('Failed to fetch')) {
            errorMessage = "No se pudo conectar con el servicio de análisis. Por favor, revisa tu conexión o inténtalo más tarde.";
        } else {
            errorMessage = e.message;
        }
    }
    
    return { data: null, error: errorMessage };
  }
}
