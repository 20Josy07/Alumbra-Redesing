
'use server';

import { type AnalysisResult } from "@/types";

export type { AnalysisResult };

const MIN_ANALYSIS_LENGTH = 20;
const ANALYSIS_TIMEOUT_MS = 20000;
const ANALYSIS_API_URL =
  process.env.ANALYSIS_API_URL ?? 'https://alumbra-api.up.railway.app/analyze';

function isValidAnalysisResult(result: unknown): result is AnalysisResult {
  if (!result || typeof result !== 'object') return false;
  const parsed = result as Partial<AnalysisResult>;
  return Boolean(
    parsed.rules &&
      parsed.score &&
      parsed.help &&
      typeof parsed.ai_suggestion === 'string'
  );
}

export async function performAnalysis(text: string): Promise<{ data: AnalysisResult | null; error: string | null }> {
  const input = text?.trim() ?? '';
  if (input.length < MIN_ANALYSIS_LENGTH) {
    return { data: null, error: `Por favor, introduce una descripción más detallada (al menos ${MIN_ANALYSIS_LENGTH} caracteres).` };
  }
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);

    const response = await fetch(ANALYSIS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", errorBody);
      throw new Error(`El servicio de análisis devolvió un error: ${response.statusText}`);
    }

    const result: unknown = await response.json();
    
    if (!isValidAnalysisResult(result)) {
      throw new Error('La respuesta del análisis de IA no tiene el formato esperado.');
    }
    
    return { data: result, error: null };

  } catch (e: unknown) {
    console.error("Error during API analysis:", e);
    
    let errorMessage = "Ocurrió un error inesperado durante el análisis. Por favor, inténtalo más tarde.";
    if (e instanceof Error) {
      if (e.name === 'AbortError') {
        errorMessage = "El análisis tardó demasiado en responder. Por favor, inténtalo de nuevo.";
      } else if (e.message.includes('Failed to fetch')) {
        errorMessage = "No se pudo conectar con el servicio de análisis. Por favor, revisa tu conexión o inténtalo más tarde.";
      } else {
        errorMessage = e.message;
      }
    }
    
    return { data: null, error: errorMessage };
  }
}
