import AnalysisSection from '@/components/analysis-section';
import Resources from '@/components/resources';
import { ShieldHalf } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12 md:py-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <header className="space-y-4 text-center">
              <ShieldHalf className="mx-auto h-16 w-16 text-primary-foreground/80" />
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                PsycheAssist
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
                A confidential tool to help you identify potential psychological abuse in your interactions.
              </p>
            </header>

            <AnalysisSection />

            <Resources />

            <footer className="text-center text-sm text-muted-foreground pt-8">
              <p>
                Disclaimer: PsycheAssist is an AI-powered tool and not a substitute for professional advice. If you are in immediate danger, please contact your local emergency services.
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
