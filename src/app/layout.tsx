import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "EventConnect | Premium Conferences",
  description: "Find and register for top conferences. Connect with attendees.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased text-slate-50 relative bg-slate-950`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none z-0"></div>
        <nav className="relative z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-500 font-mono">
                  706_NETWORK
                </Link>
              </div>
              <div className="hidden md:flex items-center">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link href="/" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium transition-colors">Discover</Link>
                  <Link href="/events/developerweek" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium transition-colors">Schedule</Link>
                  {user ? (
                    <>
                      <Link href="/admin" className="hover:text-emerald-400 text-slate-300 px-3 py-2 rounded-md font-bold transition-colors">Admin Dashboard</Link>
                      <form action={async () => {
                        "use server";
                        const supabase = await createClient();
                        await supabase.auth.signOut();
                      }}>
                        <button type="submit" className="text-slate-400 hover:text-white px-3 py-2 rounded-md font-medium transition-colors">Sign Out</button>
                      </form>
                    </>
                  ) : (
                    <Link href="/login" className="bg-fuchsia-600 hover:bg-fuchsia-500 px-5 py-2 rounded-xl text-white font-bold transition-colors font-mono tracking-tight text-sm uppercase">Organizer Login</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
