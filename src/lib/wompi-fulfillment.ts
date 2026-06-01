import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { PLAN_NAMES, getPlan, type PlanId } from '@/lib/plans';

const PAID_PLANS: PlanId[] = ['basico', 'pro', 'premium'];

export interface WompiPaymentMethod {
  type: string;
  brand?: string;
  lastFour?: string;
  label: string;
}

export interface FulfillInput {
  reference: string;
  transactionId: string;
  status: string;
  amountInCents?: number;
  paymentMethod?: WompiPaymentMethod;
}

export type FulfillResult =
  | { ok: true; outcome: 'fulfilled' | 'already_fulfilled'; plan: PlanId; uid: string }
  | { ok: false; outcome: 'ignored' | 'not_found' | 'invalid_amount' | 'not_configured' | 'error'; reason?: string };

function computePlanEnd(months = 1, from = new Date()): string {
  const d = new Date(from);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

/** Registra checkout pendiente antes de redirigir a Wompi (servidor). */
export async function createPendingCheckout(input: {
  reference: string;
  uid: string;
  plan: PlanId;
  amountInCents: number;
  email?: string;
}): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  await db.collection('wompi_checkouts').doc(input.reference).set({
    uid: input.uid,
    plan: input.plan,
    amountInCents: input.amountInCents,
    currency: 'COP',
    email: input.email || null,
    status: 'pending',
    createdAt: FieldValue.serverTimestamp(),
  });
  return true;
}

/** Activa el plan de forma idempotente (webhook o retorno del usuario). */
export async function fulfillWompiPayment(input: FulfillInput): Promise<FulfillResult> {
  const db = getAdminFirestore();
  if (!db) return { ok: false, outcome: 'not_configured' };

  const status = (input.status || '').toUpperCase();
  if (status !== 'APPROVED') {
    return { ok: false, outcome: 'ignored', reason: status };
  }

  const checkoutRef = db.collection('wompi_checkouts').doc(input.reference);
  const checkoutSnap = await checkoutRef.get();

  if (!checkoutSnap.exists) {
    return { ok: false, outcome: 'not_found', reason: 'checkout_missing' };
  }

  const checkout = checkoutSnap.data()!;
  const uid = checkout.uid as string;
  const plan = checkout.plan as PlanId;

  if (!uid || !PAID_PLANS.includes(plan)) {
    return { ok: false, outcome: 'error', reason: 'invalid_checkout' };
  }

  if (
    typeof input.amountInCents === 'number' &&
    typeof checkout.amountInCents === 'number' &&
    input.amountInCents !== checkout.amountInCents
  ) {
    return { ok: false, outcome: 'invalid_amount' };
  }

  if (checkout.status === 'fulfilled') {
    if (checkout.transactionId === input.transactionId) {
      return { ok: true, outcome: 'already_fulfilled', plan, uid };
    }
    return { ok: true, outcome: 'already_fulfilled', plan, uid };
  }

  const userRef = db.collection('users').doc(uid);
  const planMeta = getPlan(plan);
  const now = new Date().toISOString();

  const paymentRecord = {
    plan,
    planName: PLAN_NAMES[plan],
    amount: planMeta.priceAmount,
    currency: 'COP',
    method: input.paymentMethod?.label || 'Wompi',
    status: 'APPROVED',
    reference: input.reference,
    transactionId: input.transactionId,
    date: now,
  };

  try {
    await db.runTransaction(async (tx) => {
      const fresh = await tx.get(checkoutRef);
      if (!fresh.exists) throw new Error('checkout_missing');
      const data = fresh.data()!;
      if (data.status === 'fulfilled') return;

      tx.update(checkoutRef, {
        status: 'fulfilled',
        transactionId: input.transactionId,
        fulfilledAt: FieldValue.serverTimestamp(),
      });

      const userPatch: Record<string, unknown> = {
        plan,
        planEnds: computePlanEnd(1),
        cancelAtPeriodEnd: false,
        planStartedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        payments: FieldValue.arrayUnion(paymentRecord),
      };

      if (input.paymentMethod?.label) {
        userPatch.paymentMethod = {
          type: input.paymentMethod.type,
          brand: input.paymentMethod.brand ?? null,
          lastFour: input.paymentMethod.lastFour ?? null,
          label: input.paymentMethod.label,
        };
      }

      tx.set(userRef, userPatch, { merge: true });
    });

    return { ok: true, outcome: 'fulfilled', plan, uid };
  } catch {
    return { ok: false, outcome: 'error' };
  }
}
