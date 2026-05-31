'use server';

import { type AnalysisResult, type AnalysisRules, type AnalysisScore } from "@/types";

export type { AnalysisResult };

const MIN_ANALYSIS_LENGTH = 20;

/* ────────────────────────────────────────────────────────────────
   Analizador local de patrones de abuso emocional (español).

   Reemplaza la antigua API externa. Detecta, mediante léxico y
   expresiones, cinco categorías de señales comunicativas y produce
   un informe orientativo con la misma estructura que consume el
   dashboard. Es una herramienta de apoyo, no un diagnóstico.
──────────────────────────────────────────────────────────────── */

type Category =
  | 'severe_insults'
  | 'insults'
  | 'control'
  | 'gaslighting'
  | 'threats';

// Pesos por categoría — cuánto aporta cada coincidencia al score.
const WEIGHTS: Record<Category, number> = {
  threats: 5,
  severe_insults: 4,
  gaslighting: 3,
  control: 2,
  insults: 1,
};

// Léxico por categoría. Frases y palabras clave en español.
// Se comparan sin distinción de mayúsculas ni acentos.
const LEXICON: Record<Category, string[]> = {
  severe_insults: [
    'puta', 'puto', 'zorra', 'perra', 'maldita', 'maldito', 'imbecil',
    'estupida', 'estupido', 'idiota', 'inutil', 'basura', 'escoria',
    'mereces', 'no sirves', 'das asco', 'desgraciada', 'desgraciado',
    'no vales nada', 'no vales para nada', 'eres una mierda', 'eres un cero',
    'me das verguenza', 'eres patetica', 'eres patetico', 'estorbo',
    'eres un fracaso', 'ojala te', 'pedazo de',
  ],
  insults: [
    'tonta', 'tonto', 'boba', 'bobo', 'pesada', 'pesado', 'fea', 'feo',
    'gorda', 'gordo', 'loca', 'loco', 'ridicula', 'ridiculo', 'fracasada',
    'fracasado', 'amargada', 'amargado', 'inmadura', 'inmaduro',
    'no piensas', 'no sabes nada', 'que tonteria', 'eres lenta', 'eres lento',
    'cállate', 'callate', 'das pena', 'eres una carga', 'no sirves para esto',
  ],
  control: [
    'no puedes', 'no vas a', 'te prohibo', 'prohibido', 'con quien estabas',
    'con quien estuviste', 'donde estabas', 'dame tu contraseña',
    'damela tu contrasena', 'no quiero que veas', 'no quiero que hables',
    'no quiero que salgas', 'tienes que pedirme permiso', 'pideme permiso',
    'no te dejo', 'no vas a salir', 'enseñame tu telefono', 'ensename tu telefono',
    'borra ese', 'a que hora', 'reportame', 'reportate', 'no confio en ti',
    'siempre tienes que', 'me perteneces', 'eres mia', 'eres mio',
    'no te vistas asi', 'que ropa', 'no veas a tus amigas', 'no veas a tus amigos',
    'aleja de tu familia', 'no hables con', 'pasame tu ubicacion', 'mandame ubicacion',
    'donde estas ahora', 'con quien estas', 'no me cuelgues', 'contesta ya',
    'tienes que avisarme', 'no salgas sin', 'yo decido', 'haras lo que yo diga',
  ],
  gaslighting: [
    'estas loca', 'estas loco', 'eso nunca paso', 'nunca paso',
    'te lo imaginas', 'te lo estas imaginando', 'lo estas inventando',
    'exageras', 'estas exagerando', 'siempre dramatizas', 'eres una dramatica',
    'nadie te va a creer', 'nadie te creeria', 'estas mal de la cabeza',
    'yo nunca dije eso', 'nunca dije eso', 'te lo estas inventando',
    'eres muy sensible', 'todo te afecta', 'siempre te victimizas',
    'estas confundida', 'estas confundido', 'no fue para tanto',
    'estas paranoica', 'estas paranoico', 'te lo tomas todo mal',
    'siempre malinterpretas', 'es tu culpa', 'tu me obligaste', 'me hiciste enojar',
    'por tu culpa', 'todo lo malo es por ti', 'estas inventando cosas',
    'estas imaginando cosas', 'tienes problemas mentales',
  ],
  threats: [
    'te vas a arrepentir', 'te arrepentiras', 'si me dejas', 'si me dejas te',
    'te voy a', 'atente a las consecuencias', 'no respondo', 'no respondo de mi',
    'ya veras', 'te voy a hacer', 'te puede pasar algo', 'cuidate',
    'no sabes de lo que soy capaz', 'lo vas a lamentar', 'te quedaras sin nada',
    'nadie te va a querer', 'no vas a poder sin mi', 'me las pagaras',
    'si te vas', 'te quitare', 'no volveras a ver', 'voy a contar tus',
    'voy a publicar', 'voy a decir a todos', 'si hablas', 'si me denuncias',
    'te voy a buscar', 'se donde vives', 'no tienes a donde ir', 'te destruire',
  ],
};

const RULE_FIELDS: Record<Category, { detected: keyof AnalysisRules; count: keyof AnalysisRules }> = {
  severe_insults: { detected: 'severe_insults_detected', count: 'severe_insult_count' },
  insults: { detected: 'insults_detected', count: 'insult_count' },
  control: { detected: 'control_detected', count: 'control_count' },
  gaslighting: { detected: 'gaslighting_detected', count: 'gaslighting_count' },
  threats: { detected: 'threats_detected', count: 'threat_count' },
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // quita acentos (marcas combinantes)
}

function buildRules(normalized: string): { rules: AnalysisRules; raw: number } {
  const rules: AnalysisRules = {
    severe_insults_detected: [],
    insults_detected: [],
    control_detected: [],
    gaslighting_detected: [],
    threats_detected: [],
    severe_insult_count: 0,
    insult_count: 0,
    control_count: 0,
    gaslighting_count: 0,
    threat_count: 0,
  };

  // 1. Recolecta TODAS las coincidencias con su posición y categoría.
  interface Match { start: number; end: number; category: Category; phrase: string }
  const matches: Match[] = [];
  (Object.keys(LEXICON) as Category[]).forEach((category) => {
    for (const phrase of LEXICON[category]) {
      const needle = normalize(phrase);
      if (!needle) continue;
      let idx = normalized.indexOf(needle);
      while (idx !== -1) {
        matches.push({ start: idx, end: idx + needle.length, category, phrase });
        idx = normalized.indexOf(needle, idx + needle.length);
      }
    }
  });

  // 2. Resuelve solapamientos con la MISMA lógica que el resaltado
  //    (ordena por inicio, luego por fin; descarta lo que se solapa).
  //    Así una frase contenida en otra (ej. "nunca pasó" dentro de
  //    "eso nunca pasó") no se cuenta dos veces, y el conteo coincide
  //    exactamente con los fragmentos resaltados.
  matches.sort((a, b) => a.start - b.start || a.end - b.end);

  let raw = 0;
  let cursor = -1;
  for (const m of matches) {
    if (m.start < cursor) continue; // se solapa con una ya elegida → ignorar
    cursor = m.end;
    const fields = RULE_FIELDS[m.category];
    (rules[fields.count] as number) += 1;
    const detected = rules[fields.detected] as string[];
    if (!detected.includes(m.phrase)) detected.push(m.phrase);
    raw += WEIGHTS[m.category];
  }

  return { rules, raw };
}

function buildScore(raw: number): AnalysisScore {
  // Curva saturante: mucho impacto al principio, se acerca a 100 sin pasarse.
  const percent = raw === 0 ? 0 : Math.min(100, Math.round((raw / (raw + 6)) * 100));

  let risk_level: AnalysisScore['risk_level'];
  let message: string;

  if (raw === 0) {
    risk_level = 'bajo';
    message = 'No se detectaron patrones lingüísticos asociados a abuso emocional en este texto. Recuerda que el análisis es orientativo y no sustituye el criterio profesional.';
  } else if (percent < 30) {
    risk_level = 'bajo';
    message = 'Se detectaron señales leves. Pueden corresponder a un conflicto puntual, pero conviene observar si se repiten en el tiempo.';
  } else if (percent < 55) {
    risk_level = 'medio';
    message = 'Se identificaron varios patrones que merecen atención. Recomendamos analizar el contexto y la frecuencia de estas dinámicas.';
  } else if (percent < 78) {
    risk_level = 'alto';
    message = 'Se detectaron patrones significativos asociados a dinámicas de abuso psicológico. Es recomendable una evaluación profesional del caso.';
  } else {
    risk_level = 'muy alto';
    message = 'Se detectaron múltiples patrones graves, incluyendo posibles amenazas o coerción. Considera priorizar la seguridad y buscar apoyo profesional especializado.';
  }

  return {
    score_raw: raw,
    score_percent: percent,
    risk_level,
    message,
  };
}

function buildHelp(score: AnalysisScore) {
  if (score.risk_level === 'bajo') {
    return {
      title: 'Información de apoyo',
      message: 'Si en algún momento sientes malestar por la forma en que te comunican las cosas, hablar con un profesional de la salud mental puede ayudarte a tener mayor claridad.',
    };
  }
  return {
    title: '¿Necesitas ayuda?',
    message: 'Si tú o alguien que conoces está viviendo una situación de abuso, no estás solo/a. Consulta la sección de Recursos de Ayuda para encontrar líneas de apoyo confidenciales y gratuitas.',
  };
}

function buildSuggestion(rules: AnalysisRules, score: AnalysisScore): string {
  if (score.score_raw === 0) {
    return 'El texto no presenta indicadores claros de abuso emocional. Aun así, si la conversación te generó incomodidad, vale la pena reflexionar sobre por qué y, si lo consideras, comentarlo con un profesional.';
  }

  const focos: string[] = [];
  if (rules.threat_count > 0) focos.push('posibles amenazas o intimidación');
  if (rules.gaslighting_count > 0) focos.push('gaslighting (hacer dudar de la propia percepción)');
  if (rules.control_count > 0) focos.push('conductas de control');
  if (rules.severe_insult_count > 0) focos.push('insultos graves o desvalorización');
  if (rules.insult_count > 0 && rules.severe_insult_count === 0) focos.push('descalificaciones');

  const lista = focos.length > 1
    ? focos.slice(0, -1).join(', ') + ' y ' + focos[focos.length - 1]
    : focos[0];

  const cierre = score.risk_level === 'muy alto' || score.risk_level === 'alto'
    ? ' Dada la intensidad de los patrones detectados, se recomienda documentar las conversaciones y buscar acompañamiento profesional.'
    : ' Conviene observar si estos patrones se repiten y abordarlos con apoyo profesional si persisten.';

  return `El análisis identifica principalmente ${lista}.${cierre} Recuerda que este resultado es orientativo y debe interpretarse dentro de un contexto clínico.`;
}

export async function performAnalysis(
  text: string
): Promise<{ data: AnalysisResult | null; error: string | null }> {
  const input = text?.trim() ?? '';

  if (input.length < MIN_ANALYSIS_LENGTH) {
    return {
      data: null,
      error: `Por favor, introduce una conversación más detallada (al menos ${MIN_ANALYSIS_LENGTH} caracteres).`,
    };
  }

  try {
    // Pequeña espera para reflejar el procesamiento (UX del spinner).
    await new Promise((r) => setTimeout(r, 600));

    const normalized = normalize(input);
    const { rules, raw } = buildRules(normalized);
    const score = buildScore(raw);
    const help = buildHelp(score);
    const ai_suggestion = buildSuggestion(rules, score);

    return { data: { rules, score, help, ai_suggestion }, error: null };
  } catch (e) {
    console.error('Error durante el análisis local:', e);
    return {
      data: null,
      error: 'Ocurrió un error inesperado durante el análisis. Por favor, inténtalo de nuevo.',
    };
  }
}
