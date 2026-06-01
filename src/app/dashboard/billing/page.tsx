'use client';

import { useState, useMemo } from 'react';
import { doc, collection, query, orderBy, type Timestamp } from 'firebase/firestore';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { setUserPlan, setSubscriptionCancel, computePlanEnd } from '@/firebase/firestore/usage';
import { PLANS, PLAN_LIMITS, PLAN_NAMES, getPlan, currentMonthKey, type PlanId } from '@/lib/plans';
import { lookupPromo } from '@/lib/promo-codes';
import { redirectToCheckout } from '@/lib/checkout-redirect';
import { type AnalysisRecord } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Reveal } from '@/components/reveal';
import { cn } from '@/lib/utils';
import {
  CreditCard, Tag, Clock, Loader, FileText, TrendingUp, Crown,
  CheckCircle2, AlertCircle, RotateCcw, Wallet, Shield, Receipt,
} from 'lucide-react';

export default function BillingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [working, setWorking] = useState(false);
  const [upgrading, setUpgrading] = useState<PlanId | null>(null);

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: account } = useDoc<{
    plan?: PlanId;
    planEnds?: string;
    cancelAtPeriodEnd?: boolean;
    usageMonth?: string;
    usageCount?: number;
    paymentMethod?: { type?: string; brand?: string; lastFour?: string; label?: string };
    payments?: { planName?: string; amount?: number; currency?: string; method?: string; status?: string; reference?: string; date?: string }[];
  }>(userDocRef);

  const payments = [...(account?.payments ?? [])].sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );
  const formatCOP = (n?: number) =>
    typeof n === 'number' ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n) : '—';

  const analysesQuery = useMemoFirebase(
    () => (user && firestore ? query(collection(firestore, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc')) : null),
    [user, firestore]
  );
  const { data: analyses } = useCollection<AnalysisRecord>(analysesQuery);

  // Plan efectivo (considerando expiración)
  const storedPlan: PlanId = account?.plan ?? 'gratis';
  const subActive =
    storedPlan === 'gratis' || (!!account?.planEnds && new Date(account.planEnds).getTime() > Date.now());
  const currentPlan: PlanId = subActive ? storedPlan : 'gratis';
  const meta = getPlan(currentPlan);
  const isPaid = currentPlan !== 'gratis';
  const cancelScheduled = !!account?.cancelAtPeriodEnd && isPaid;

  // Planes superiores al actual (para mejorar). Premium no tiene mejora.
  const PLAN_ORDER: PlanId[] = ['gratis', 'basico', 'pro', 'premium'];
  const currentRank = PLAN_ORDER.indexOf(currentPlan);
  const upgradePlans = PLANS.filter((p) => PLAN_ORDER.indexOf(p.id) > currentRank);

  const planEndsDate = account?.planEnds ? new Date(account.planEnds) : null;
  const planEndsLabel = planEndsDate
    ? planEndsDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  // Estadísticas de uso
  const limit = PLAN_LIMITS[currentPlan];
  const isUnlimited = limit === Infinity;
  const usageCount = account?.usageMonth === currentMonthKey() ? account?.usageCount ?? 0 : 0;
  const totalAnalyses = analyses?.length ?? 0;
  const thisMonthAnalyses = useMemo(() => {
    const now = new Date();
    return (analyses ?? []).filter((r) => {
      const ts = r.createdAt as Timestamp | undefined;
      const d = ts && typeof ts.toDate === 'function' ? ts.toDate() : null;
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [analyses]);

  const handleUpgrade = async (planId: PlanId) => {
    if (!user) return;
    setUpgrading(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, uid: user.uid, email: user.email }),
      });
      if (res.status === 503) {
        toast({ title: 'Pagos próximamente', description: 'La pasarela aún no está activa. Usa un código promocional mientras tanto.' });
        return;
      }
      const data = await res.json();
      if (!redirectToCheckout(data)) {
        toast({ variant: 'destructive', title: 'No se pudo iniciar el pago', description: 'Inténtalo de nuevo.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error de conexión', description: 'Inténtalo de nuevo.' });
    } finally {
      setUpgrading(null);
    }
  };

  const handleRedeem = async () => {
    const promo = lookupPromo(promoCode);
    if (!promo) {
      toast({ variant: 'destructive', title: 'Código no válido', description: 'Revisa el código e inténtalo de nuevo.' });
      return;
    }
    if (!user || !firestore) return;
    setRedeeming(true);
    try {
      await setUserPlan(firestore, user.uid, promo.plan, computePlanEnd(1));
      toast({ title: `¡Plan ${PLAN_NAMES[promo.plan]} activado!`, description: 'Tu código se aplicó correctamente. Sin cargos.' });
      setPromoCode('');
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo aplicar el código.' });
    } finally {
      setRedeeming(false);
    }
  };

  const handleCancel = async () => {
    if (!user || !firestore) return;
    setWorking(true);
    try {
      await setSubscriptionCancel(firestore, user.uid, true);
      toast({
        title: 'Suscripción cancelada',
        description: `Mantienes tu plan ${PLAN_NAMES[currentPlan]} hasta el ${planEndsLabel}. Después pasarás a Gratis.`,
      });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cancelar. Inténtalo de nuevo.' });
    } finally {
      setWorking(false);
    }
  };

  const handleReactivate = async () => {
    if (!user || !firestore) return;
    setWorking(true);
    try {
      await setSubscriptionCancel(firestore, user.uid, false);
      toast({ title: 'Suscripción reactivada', description: 'Tu plan se renovará automáticamente.' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo reactivar.' });
    } finally {
      setWorking(false);
    }
  };

  const stats = [
    { label: 'Análisis este mes', value: isUnlimited ? `${thisMonthAnalyses}` : `${usageCount}/${limit}`, icon: TrendingUp },
    { label: 'Análisis totales', value: String(totalAnalyses), icon: FileText },
    { label: 'Límite mensual', value: isUnlimited ? 'Ilimitado' : String(limit), icon: Crown },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          Plan y facturación
        </h1>
        <p className="text-sm text-gray-400 mt-1 ml-11">Consulta tu plan, tu uso y gestiona tu suscripción.</p>
      </div>

      {/* Resumen del plan */}
      <Reveal as="div">
        <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan actual</p>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-2xl font-black text-gray-900">{PLAN_NAMES[currentPlan]}</span>
                  {isPaid && (
                    cancelScheduled
                      ? <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold text-[11px]">Cancelada</Badge>
                      : <Badge className="bg-green-100 text-green-700 border-green-200 font-bold text-[11px]">Activa</Badge>
                  )}
                </div>
                <p className="text-2xl font-black text-gradient mt-1">{meta.price}{isPaid && <span className="text-sm text-gray-400 font-medium"> /mes</span>}</p>
              </div>
              <div className="text-right">
                {isPaid && planEndsLabel ? (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {cancelScheduled ? 'Termina el' : 'Se renueva el'} <span className="font-semibold text-gray-700">{planEndsLabel}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Plan gratuito · sin caducidad</p>
                )}
              </div>
            </div>

            {/* Aviso de cancelación programada */}
            {cancelScheduled && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed flex-1">
                  Tu suscripción no se renovará. Conservas el plan <span className="font-bold">{PLAN_NAMES[currentPlan]}</span> hasta
                  el <span className="font-bold">{planEndsLabel}</span> y luego pasarás automáticamente a Gratis.
                </p>
                <Button onClick={handleReactivate} disabled={working} size="sm" variant="outline" className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-100 font-semibold flex-shrink-0">
                  {working ? <Loader className="w-4 h-4 animate-spin" /> : <><RotateCcw className="w-3.5 h-3.5 mr-1" /> Reactivar</>}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* Mejorar plan (oculto si ya es Premium) */}
      {upgradePlans.length > 0 && (
        <Reveal as="div" delay={40}>
          <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-4 h-4 text-primary" />
                <p className="text-sm font-black text-gray-900">Mejora tu plan</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {upgradePlans.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-purple-100/70 bg-purple-50/30 p-4">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-gray-900">{p.name}</span>
                        <span className="text-xs text-gray-400">{p.price}/mes</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {p.limit === Infinity ? 'Análisis ilimitados' : `${p.limit} análisis/mes`}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleUpgrade(p.id)}
                      disabled={upgrading === p.id}
                      size="sm"
                      className="rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold text-xs flex-shrink-0"
                    >
                      {upgrading === p.id ? <Loader className="w-4 h-4 animate-spin" /> : 'Mejorar'}
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-3">Pago seguro con Wompi · cancela cuando quieras.</p>
            </CardContent>
          </Card>
        </Reveal>
      )}

      {/* Estadísticas de uso */}
      <Reveal as="div" delay={60} className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border border-purple-100/60 shadow-sm">
            <CardContent className="p-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-black text-gray-900 leading-none">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </Reveal>

      {/* Barra de uso del mes (solo planes con límite) */}
      {!isUnlimited && (
        <Reveal as="div" delay={100}>
          <Card className="rounded-3xl border border-purple-100/60 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-sm font-bold text-gray-700">Uso de este mes</p>
                <span className="text-sm font-black text-gray-900">{usageCount} <span className="text-gray-400 font-medium">/ {limit}</span></span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', usageCount >= limit ? 'bg-red-500' : 'bg-gradient-to-r from-primary to-violet-500')}
                  style={{ width: `${Math.min(100, (usageCount / limit) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-2">El contador se reinicia cada mes.</p>
            </CardContent>
          </Card>
        </Reveal>
      )}

      {/* Código promocional */}
      <Reveal as="div" delay={140}>
        <Card className="rounded-3xl border border-purple-100/60 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary" />
              <p className="text-sm font-black text-gray-900">¿Tienes un código promocional?</p>
            </div>
            <div className="flex gap-2 max-w-md">
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                placeholder="Ingresa tu código"
                className="h-11 rounded-xl border-purple-200 focus:border-primary bg-white text-sm uppercase placeholder:normal-case placeholder:text-gray-400"
              />
              <Button onClick={handleRedeem} disabled={redeeming || !promoCode.trim()} className="h-11 px-5 rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold text-sm shrink-0">
                {redeeming ? 'Aplicando…' : 'Canjear'}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Activa o mejora tu plan al instante, sin salir de tu panel.</p>
          </CardContent>
        </Card>
      </Reveal>

      {/* Método de pago */}
      <Reveal as="div" delay={180}>
        <Card className="rounded-3xl border border-purple-100/60 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-black text-gray-900 mb-3">Método de pago</p>
            {account?.paymentMethod?.label ? (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  {account.paymentMethod.type === 'CARD'
                    ? <CreditCard className="w-5 h-5 text-primary" />
                    : <Wallet className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{account.paymentMethod.label}</p>
                  <p className="text-xs text-gray-400">Usado en tu último pago con Wompi</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200 font-bold text-[11px]">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Activo
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Aún no tienes un método de pago</p>
                  <p className="text-xs text-gray-400">Aparecerá aquí cuando completes tu primer pago con Wompi (tarjeta, Nequi o PSE).</p>
                </div>
              </div>
            )}
            <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Procesado de forma segura por Wompi. Alumbra no almacena los datos de tu tarjeta.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      {/* Historial de pagos */}
      <Reveal as="div" delay={220}>
        <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-4 h-4 text-primary" />
              <p className="text-sm font-black text-gray-900">Historial de pagos</p>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-6 h-6 text-purple-200" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Aún no tienes pagos</p>
                <p className="text-xs text-gray-300 mt-1">Tus comprobantes aparecerán aquí.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {payments.map((p, i) => {
                  const approved = (p.status || '').toUpperCase() === 'APPROVED';
                  return (
                    <li key={i} className="flex items-center gap-3 py-3.5">
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', approved ? 'bg-green-50' : 'bg-amber-50')}>
                        <Receipt className={cn('w-4 h-4', approved ? 'text-green-600' : 'text-amber-500')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">Plan {p.planName}</p>
                        <p className="text-xs text-gray-400">
                          {p.date ? new Date(p.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                          {p.method ? ` · ${p.method}` : ''}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black text-gray-900">{formatCOP(p.amount)}</p>
                        <span className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full',
                          approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        )}>
                          {approved ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* Cancelar suscripción */}
      {isPaid && !cancelScheduled && (
        <Reveal as="div" delay={220}>
          <Card className="rounded-3xl border border-gray-200/70 shadow-sm">
            <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900">Cancelar suscripción</p>
                <p className="text-xs text-gray-400 mt-0.5 max-w-md">
                  Seguirás disfrutando tu plan hasta el final del periodo ya pagado{planEndsLabel ? ` (${planEndsLabel})` : ''}. No se hacen reembolsos del periodo en curso.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50 font-semibold flex-shrink-0">
                    Cancelar plan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-black">¿Cancelar tu suscripción?</AlertDialogTitle>
                    <AlertDialogDescription>
                      No perderás nada ahora: conservas el plan <span className="font-bold text-gray-700">{PLAN_NAMES[currentPlan]}</span> hasta
                      el <span className="font-bold text-gray-700">{planEndsLabel}</span>. Al terminar ese periodo, tu cuenta volverá al plan Gratis automáticamente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Mantener plan</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} disabled={working} className="rounded-xl bg-red-500 hover:bg-red-600 focus:ring-red-400">
                      {working ? <><Loader className="w-4 h-4 mr-2 animate-spin" /> Cancelando…</> : 'Sí, cancelar al final del mes'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </Reveal>
      )}
    </div>
  );
}
