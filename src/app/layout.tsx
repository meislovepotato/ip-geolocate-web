import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IP Geolocate',
  description: 'Simple IP geolocation viewer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="w-full bg-white/60 backdrop-blur sticky top-0 z-20 border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">
              IP Geolocate
            </Link>
            <nav>
              <Link href="/home" className="text-sm text-slate-600 hover:text-slate-900 mr-4">
                Home
              </Link>
              <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">
                Login
              </Link>
            </nav>
          </div>
        </header>
        <main className="min-h-[80vh]">{children}</main>
      </body>
    </html>
  );
}
