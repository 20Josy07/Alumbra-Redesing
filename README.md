# Alumbra

Aplicacion web con Next.js y Firebase para analizar conversaciones e identificar patrones de abuso emocional.

## Requisitos

- Node.js 20+
- npm 10+

## Configuracion local

1. Instala dependencias:

```bash
npm install
```

2. Crea tu archivo `.env.local` con base en `.env.example`.

3. Levanta el proyecto:

```bash
npm run dev
```

La app inicia por defecto en `http://localhost:9002`.

## Variables de entorno

- `ANALYSIS_API_URL`: endpoint del servicio de analisis IA.

## Scripts disponibles

- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de produccion.
- `npm run start`: servir build de produccion.
- `npm run lint`: ejecutar ESLint con Next.js.
- `npm run typecheck`: validacion de tipos TypeScript.

## Recomendaciones de calidad antes de publicar

Ejecuta siempre:

```bash
npm run typecheck
npm run lint
npm run build
```
