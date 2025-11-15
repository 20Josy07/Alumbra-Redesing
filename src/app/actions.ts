'use server';

import { analyzeText, type AnalysisResult } from "@/ai/analysis-flow";

// This interface is now imported from analysis-flow.ts
export type { AnalysisResult };

export async function performAnalysis(text: string): Promise<{ data: AnalysisResult | null; error: string | null }> {
  if (!text || text.trim().length < 20) {
    return { data: null, error: "Por favor, introduce una descripción más detallada (al menos 20 caracteres)." };
  }
  
  try {
    const result = await analyzeText(text);
    
    if (!result) {
        throw new Error('El análisis de IA no devolvió un resultado.');
    }
    
    return { data: result, error: null };

  } catch (e: any) {
    console.error("Error during AI analysis:", e);
    
    let errorMessage = "Ocurrió un error inesperado durante el análisis. Por favor, inténtalo más tarde.";
    if (e.message) {
        if (e.message.includes('API key not valid')) {
            errorMessage = "La clave de API para el servicio de IA no es válida. Por favor, verifica la configuración.";
        } else if (e.message.includes('model not found')) {
            errorMessage = "El modelo de IA especificado no se pudo encontrar. Por favor, contacta a soporte.";
        } else {
            errorMessage = e.message;
        }
    }
    
    return { data: null, error: errorMessage };
  }
}
