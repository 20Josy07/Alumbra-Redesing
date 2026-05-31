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
- `RESEND_API_KEY`: API key de Resend para enviar las alertas por correo.
- `ALERT_EMAIL_FROM`: remitente de las alertas, p. ej. `"Alumbra <alertas@tudominio.com>"`. El dominio debe estar verificado en Resend.
- `ALERT_REPLY_TO`: (opcional) correo de respuesta.

## Alertas por correo en riesgo alto

Cuando un análisis arroja un nivel de riesgo **alto** o **muy alto**, Alumbra puede
enviar un correo de aviso a un **contacto de confianza** (sin incluir el texto de la
conversación, solo el nivel de riesgo y las señales detectadas).

1. El usuario registra el contacto en **Dashboard → Configuración → Contacto de confianza**
   y activa "Enviar alerta automáticamente".
2. El servidor manda el correo con [Resend](https://resend.com) (capa gratuita: 3.000/mes).
3. Define `RESEND_API_KEY` y `ALERT_EMAIL_FROM` en `.env.local`. Sin estas variables la
   función queda inactiva y la UI lo indica.

## Entregabilidad: que los correos no caigan en spam

La causa #1 de que un correo acabe en spam es un dominio sin autenticar. Para evitarlo:

### A) Correos de alerta (Resend)

1. En Resend → **Domains**, añade tu dominio (ej. `tudominio.com`).
2. Copia los registros DNS que te da Resend y créalos en tu proveedor de dominio:
   - **SPF** (TXT): autoriza a Resend a enviar en tu nombre.
   - **DKIM** (CNAME/TXT): firma criptográfica de cada correo.
   - **DMARC** (TXT en `_dmarc.tudominio.com`), por ejemplo:
     `v=DMARC1; p=quarantine; rua=mailto:dmarc@tudominio.com`
3. Espera a que Resend marque el dominio como **Verified** y usa ese dominio en
   `ALERT_EMAIL_FROM`. Usa siempre un remitente con nombre y un `reply-to` real.

### B) Correos de Firebase Auth (restablecer contraseña, verificación)

Por defecto se envían desde el dominio de Firebase y suelen ir a spam. Para mejorarlo:

1. **Firebase Console → Authentication → Templates → Plantillas de correo**.
2. Edita la plantilla y, en "Personalizar dominio", configura un **dominio remitente
   propio** (ej. `noreply@tudominio.com`).
3. Firebase te dará registros **TXT/CNAME (SPF y DKIM)** para añadir en tu DNS.
4. Una vez verificado, los correos de restablecimiento saldrán desde tu dominio
   autenticado y dejarán de marcarse como spam.
5. Recomendado: personaliza el asunto y el remitente para que el usuario reconozca a Alumbra.

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
