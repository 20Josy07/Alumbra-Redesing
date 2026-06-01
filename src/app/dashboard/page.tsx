'use client';

import { useEffect, useState } from "react";
import DashboardPage from "@/components/dashboard-page";
import type { AnalysisResult } from "@/app/actions";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
    const [pendingAnalysis, setPendingAnalysis] = useState<AnalysisResult | null>(null);
    const { user } = useUser();
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

    // Tras volver de Wompi: confirma el pago en servidor (idempotente con el webhook).
    useEffect(() => {
        if (!user) return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout') !== 'success') return;

        const plan = params.get('plan');
        const txId = params.get('id');
        window.history.replaceState({}, '', '/dashboard');

        if (!txId) {
            toast({
                title: 'Pago recibido',
                description: 'Si tu pago fue aprobado, el plan se activará en unos segundos. Revisa Plan y facturación.',
            });
            return;
        }

        const confirm = async () => {
            try {
                const res = await fetch('/api/wompi/fulfill', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transactionId: txId }),
                });
                const data = await res.json().catch(() => ({}));

                if (res.ok && data.ok) {
                    toast({
                        title: data.outcome === 'already_fulfilled' ? '¡Plan activo!' : '¡Plan activado!',
                        description: `Tienes el plan ${data.planName || plan}. ¡Gracias!`,
                    });
                    return;
                }

                if (data.status && data.status !== 'APPROVED') {
                    toast({
                        variant: 'destructive',
                        title: 'Pago no completado',
                        description: 'Wompi no aprobó el pago. Si crees que es un error, contáctanos.',
                    });
                    return;
                }

                toast({
                    title: 'Estamos confirmando tu pago',
                    description: 'Tu plan se activará en cuanto Wompi confirme el pago. Revisa Plan y facturación en un minuto.',
                });
            } catch {
                toast({
                    title: 'Estamos confirmando tu pago',
                    description: 'Si ya pagaste, el plan se activará automáticamente. Revisa Plan y facturación.',
                });
            }
        };

        void confirm();
    }, [user, toast]);

    return <DashboardPage pendingAnalysis={pendingAnalysis} setPendingAnalysis={setPendingAnalysis} />;
}
