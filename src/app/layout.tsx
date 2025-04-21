import { Toaster } from 'sonner';
import './globals.css';
import { Inter } from 'next/font/google';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Astra Project',
  description: 'Marketplace para creadores de contenido',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        {/* Toaster global */}
        <Toaster />
      </body>
    </html>
  );
}