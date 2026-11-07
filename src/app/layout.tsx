import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'StartTheBrand — High-Performance Apparel Design & 3D Garment Studio',
  description: 'Professional apparel design workspace, real-time 3D PBR garment visualization, print production tools (Halftone, Threshold, Knockout, DTF Gang Sheet Builder), and merch profit calculator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen antialiased selection:bg-brand-volt selection:text-black">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#121316',
              border: '1px solid #23262f',
              color: '#f5f6f8',
              fontFamily: 'monospace',
              fontSize: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
