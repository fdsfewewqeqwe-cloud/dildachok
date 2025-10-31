import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "БУНКЕР - Оружейный магазин",
  description: "Лучшее оружие для защиты и охоты. Широкий выбор, гарантия качества.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <header className="sticky top-0 z-50 glass-effect border-b border-blue-500/30 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <img 
                    src="/logo.png" 
                    alt="БУНКЕР" 
                    className="relative w-10 h-10 object-contain rounded-lg flex-shrink-0"
                  />
                </div>
                <div className="text-xl font-black tracking-widest">
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-500 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:via-cyan-400 group-hover:to-blue-500 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(59,130,246,0.8)] uppercase">
                    БУНКЕР
                  </span>
                </div>
              </Link>
              <div className="hidden md:flex gap-3">
                <Link href="/" className="px-3 py-1.5 rounded-lg text-gray-300 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/30 hover:text-blue-300">
                  Главная
                </Link>
                <Link href="/#categories" className="px-3 py-1.5 rounded-lg text-gray-300 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/30 hover:text-blue-300">
                  Категории
                </Link>
                <Link href="/#catalog" className="px-3 py-1.5 rounded-lg text-gray-300 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/30 hover:text-blue-300">
                  Каталог
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="glass-effect border-t border-blue-500/20 py-4 mt-12 md:ml-56">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-400 text-sm">&copy; 2025 БУНКЕР. Все права защищены.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
