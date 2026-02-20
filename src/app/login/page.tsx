"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // Determine the current origin dynamically
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Check your email for the magic link!' });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center -mt-10">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to your EventConnect account</p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-5"
                >
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="you@company.com"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors shadow-lg shadow-white/10 mt-2"
                    >
                        {loading ? 'Sending...' : 'Send Magic Link'}
                    </button>

                    {message && (
                        <div className={`p-4 rounded-xl text-center text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {message.text}
                        </div>
                    )}
                </form>

                <p className="text-center text-sm text-slate-500 mt-8">
                    We&apos;ll send a secure login link to your email. No passwords needed.
                </p>
            </div>
        </div>
    )
}
