
import DashboardPage from "@/components/dashboard-page";
import type { AnalysisResult } from "@/app/actions";

interface DashboardProps {
  pendingAnalysis?: AnalysisResult | null;
}

export default function Dashboard({ pendingAnalysis }: DashboardProps) {
    return <DashboardPage pendingAnalysis={pendingAnalysis} />;
}
