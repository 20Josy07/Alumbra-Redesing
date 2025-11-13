'use client';

import { useEffect, useState } from "react";
import DashboardPage from "@/components/dashboard-page";
import type { AnalysisResult } from "@/app/actions";

export default function Dashboard() {
    const [pendingAnalysis, setPendingAnalysis] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        // Check for pending analysis result in sessionStorage
        const pendingResult = sessionStorage.getItem('pendingAnalysisResult');
        if (pendingResult) {
            try {
                const parsedResult = JSON.parse(pendingResult);
                setPendingAnalysis(parsedResult);
                // Clear the result from storage so it's not shown again on reload
                sessionStorage.removeItem('pendingAnalysisResult');
            } catch (e) {
                console.error("Failed to parse pending analysis result:", e);
                sessionStorage.removeItem('pendingAnalysisResult');
            }
        }
    }, []);

    return <DashboardPage pendingAnalysis={pendingAnalysis} setPendingAnalysis={setPendingAnalysis} />;
}
