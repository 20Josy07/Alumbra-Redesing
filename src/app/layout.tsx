import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Alumbra',
  description: 'IA Que detecta abuso emocional en conversaciones',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased bg-background text-foreground`}>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
