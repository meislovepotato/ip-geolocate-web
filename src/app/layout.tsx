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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="font-bold text-slate-900 text-lg">IP Geolocate</span>
            </Link>
            <nav className="flex items-center gap-8">
              <Link
                href="/home"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Home
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Login
              </Link>
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-80px)] bg-slate-50">{children}</main>
      </body>
    </html>
  );
}
