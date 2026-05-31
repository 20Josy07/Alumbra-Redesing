'use client';

import { Firestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { currentMonthKey, type PlanId } from '@/lib/plans';

export interface TrustedContact {
  name: string;
  email: string;
}

export interface UserAccount {
  /** Plan efectivo (ya considerando si la suscripción venció) */
  plan: PlanId;
  /** Fin de la suscripción en ISO, o null si es Gratis / sin vencimiento */
  planEnds: string | null;
  usageMonth: string;
  usageCount: number;
}

/** Devuelve true si la suscripción de pago sigue vigente. */
export function isSubscriptionActive(plan: PlanId, planEnds: string | null | undefined): boolean {
  if (plan === 'gratis') return true;
  if (!planEnds) return false;
  return new Date(planEnds).getTime() > Date.now();
}

/** Fecha de fin de suscripción: ahora + N meses (por defecto 1), en ISO. */
export function computePlanEnd(months = 1, from = new Date()): string {
  const d = new Date(from);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

/**
 * Lee el plan, su vencimiento y el uso del mes actual.
 * Si la suscripción de pago venció, el plan efectivo pasa a 'gratis'.
 */
export async function getAccount(db: Firestore, uid: string): Promise<UserAccount> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  const month = currentMonthKey();

  const storedPlan = (data.plan as PlanId) || 'gratis';
  const planEnds = (data.planEnds as string) || null;
  const effectivePlan: PlanId = isSubscriptionActive(storedPlan, planEnds) ? storedPlan : 'gratis';

  const sameMonth = data.usageMonth === month;
  return {
    plan: effectivePlan,
    planEnds,
    usageMonth: month,
    usageCount: sameMonth ? (data.usageCount as number) || 0 : 0,
  };
}

/** Suma 1 al contador de análisis del mes actual (lo reinicia si cambió de mes). */
export async function incrementUsage(db: Firestore, uid: string): Promise<void> {
  const account = await getAccount(db, uid);
  const ref = doc(db, 'users', uid);
  await setDoc(
    ref,
    {
      usageMonth: currentMonthKey(),
      usageCount: account.usageCount + 1,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Activa/actualiza el plan del usuario con su fecha de vencimiento.
 * Para planes pagos, si no se pasa `planEnds`, se calcula a +1 mes.
 * Reinicia cualquier cancelación previa (suscripción nueva = activa).
 */
export async function setUserPlan(
  db: Firestore,
  uid: string,
  plan: PlanId,
  planEnds?: string | null
): Promise<void> {
  const ref = doc(db, 'users', uid);
  const ends = plan === 'gratis' ? null : planEnds ?? computePlanEnd(1);
  await setDoc(
    ref,
    {
      plan,
      planEnds: ends,
      cancelAtPeriodEnd: false,
      planStartedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Guarda (o limpia) el contacto de confianza y la preferencia de alerta
 * automática del usuario. Pasar `contact = null` borra el contacto.
 */
export async function setTrustedContact(
  db: Firestore,
  uid: string,
  contact: TrustedContact | null,
  autoAlertEnabled: boolean
): Promise<void> {
  const ref = doc(db, 'users', uid);
  await setDoc(
    ref,
    {
      trustedContact: contact && contact.email ? { name: contact.name || '', email: contact.email } : null,
      autoAlertEnabled,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Programa o revierte la cancelación de la suscripción.
 * No corta el acceso de inmediato: el plan sigue activo hasta `planEnds`
 * y, al vencer, la lógica de expiración lo devuelve a Gratis.
 */
export async function setSubscriptionCancel(db: Firestore, uid: string, cancel: boolean): Promise<void> {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { cancelAtPeriodEnd: cancel, updatedAt: serverTimestamp() }, { merge: true });
}
