'use client';

import { useEffect, useState } from "react";
import DashboardPage from "@/components/dashboard-page";
import type { AnalysisResult } from "@/app/actions";
import { useUser, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { setUserPlan, setPaymentMethod, recordPayment } from "@/firebase/firestore/usage";
import { PLAN_NAMES, getPlan, type PlanId } from "@/lib/plans";

export default function Dashboard() {
    const [pendingAnalysis, setPendingAnalysis] = useState<AnalysisResult | null>(null);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => {
        const pendingResult = sessionStorage.getItem('pendingAnalysisResult');
        if (pendingResult) {
            try {
                setPendingAnalysis(JSON.parse(pendingResult));
                sessionStorage.removeItem('pendingAnalysisResult');
            } catch {
                sessionStorage.removeItem('pendingAnalysisResult');
            }
        }
    }, []);

    // Activación de plan tras volver del pago (?checkout=success&plan=...&id=...)
    useEffect(() => {
        if (!user || !firestore) return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout') !== 'success') return;
        const plan = params.get('plan') as PlanId | null;
        const txId = params.get('id'); // Wompi añade el id de la transacción
        if (!plan || !['basico', 'pro', 'premium'].includes(plan)) {
            window.history.replaceState({}, '', '/dashboard');
            return;
        }

        const activate = async () => {
            try {
                // Verifica la transacción en Wompi y guarda el método de pago
                if (txId) {
                    const res = await fetch(`/api/wompi/transaction?id=${encodeURIComponent(txId)}`);
                    if (res.ok) {
                        const data = await res.json();
                        // Solo activamos si Wompi confirma el pago aprobado
                        if (data.status && data.status !== 'APPROVED') {
                            toast({
                                variant: 'destructive',
                                title: 'Pago no completado',
                                description: 'No pudimos confirmar tu pago. Si crees que es un error, contáctanos.',
                            });
                            window.history.replaceState({}, '', '/dashboard/billing');
                            return;
                        }
                        if (data.paymentMethod?.label) {
                            await setPaymentMethod(firestore, user.uid, data.paymentMethod).catch(() => {});
                        }
                        // Registra el pago en el historial
                        await recordPayment(firestore, user.uid, {
                            plan,
                            planName: PLAN_NAMES[plan],
                            amount: getPlan(plan).priceAmount,
                            currency: 'COP',
                            method: data.paymentMethod?.label || 'Wompi',
                            status: data.status || 'APPROVED',
                            reference: data.reference || txId,
                            date: new Date().toISOString(),
                        }).catch(() => {});
                    }
                }
                await setUserPlan(firestore, user.uid, plan);
                toast({ title: '¡Plan activado!', description: `Ahora tienes el plan ${PLAN_NAMES[plan]}. ¡Gracias!` });
            } catch {
                /* noop */
            } finally {
                window.history.replaceState({}, '', '/dashboard');
            }
        };
        activate();
    }, [user, firestore, toast]);

    return <DashboardPage pendingAnalysis={pendingAnalysis} setPendingAnalysis={setPendingAnalysis} />;
}
