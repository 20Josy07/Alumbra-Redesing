import type { ActionCodeSettings } from 'firebase/auth';

/** Base URL pública de la app (sin barra final). */
export function getAppOrigin(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return 'https://alumbraia.com';
}

/** Ruta que Firebase debe usar como URL de acción personalizada. */
export function getAuthActionUrl(): string {
  return `${getAppOrigin()}/auth/action`;
}

/** Opciones al enviar correos de cuenta (restablecer contraseña, etc.). */
export function buildAuthActionSettings(continuePath = '/login'): ActionCodeSettings {
  const origin = getAppOrigin();
  const path = continuePath.startsWith('/') ? continuePath : `/${continuePath}`;
  return {
    url: `${origin}${path}`,
    handleCodeInApp: true,
  };
}

export type AuthActionMode =
  | 'resetPassword'
  | 'verifyEmail'
  | 'recoverEmail'
  | 'verifyAndChangeEmail';

export function parseAuthActionMode(value: string | null): AuthActionMode | null {
  if (
    value === 'resetPassword' ||
    value === 'verifyEmail' ||
    value === 'recoverEmail' ||
    value === 'verifyAndChangeEmail'
  ) {
    return value;
  }
  return null;
}

/** Evita redirecciones abiertas con continueUrl de terceros. */
export function safeContinueUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const target = new URL(raw);
    const origin = getAppOrigin();
    if (target.origin === origin) return target.pathname + target.search + target.hash;
  } catch {
    /* ignore */
  }
  return null;
}

export function authActionErrorMessage(code: string): string {
  switch (code) {
    case 'auth/expired-action-code':
      return 'Este enlace ha caducado. Solicita uno nuevo desde la app.';
    case 'auth/invalid-action-code':
      return 'Este enlace no es válido o ya fue utilizado.';
    case 'auth/user-disabled':
      return 'Esta cuenta está deshabilitada. Contacta con soporte.';
    case 'auth/user-not-found':
      return 'No encontramos una cuenta con estos datos.';
    case 'auth/weak-password':
      return 'La contraseña es muy débil. Usa al menos 6 caracteres.';
    default:
      return 'No pudimos completar la acción. Inténtalo de nuevo.';
  }
}

export function getAuthErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : '';
  }
  return '';
}
