'use client';

import { useEffect, useState } from "react";
import DashboardPage from "@/components/dashboard-page";
import type { AnalysisResult } from "@/app/actions";
import { useUser, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { setUserPlan } from "@/firebase/firestore/usage";
import { PLAN_NAMES, type PlanId } from "@/lib/plans";

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

    // Activación de plan tras volver de Stripe Checkout (?checkout=success&plan=...)
    useEffect(() => {
        if (!user || !firestore) return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout') !== 'success') return;
        const plan = params.get('plan') as PlanId | null;
        if (plan && ['basico', 'pro', 'premium'].includes(plan)) {
            setUserPlan(firestore, user.uid, plan)
                .then(() => toast({ title: '¡Plan activado!', description: `Ahora tienes el plan ${PLAN_NAMES[plan]}. ¡Gracias!` }))
                .catch(() => {});
        }
        // Limpia los parámetros de la URL
        window.history.replaceState({}, '', '/dashboard');
    }, [user, firestore, toast]);

    return <DashboardPage pendingAnalysis={pendingAnalysis} setPendingAnalysis={setPendingAnalysis} />;
}
