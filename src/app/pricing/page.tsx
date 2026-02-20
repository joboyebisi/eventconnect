import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="min-h-screen py-32 relative bg-slate-950">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-fuchsia-900/10 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter font-mono uppercase bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-500">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-slate-400 font-light">Everything you need to run your next massive tech conference.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">

                    {/* Tier 1 */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col font-mono">
                        <h3 className="text-xl font-bold text-slate-300 mb-2 uppercase">Starter</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-black text-white">Free</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 pb-8 border-b border-slate-800 font-sans">For small meetups and community gatherings.</p>
                        <ul className="space-y-4 mb-8 flex-1 font-sans">
                            <li className="flex items-center gap-3 text-slate-300"><Zap className="w-5 h-5 text-slate-500" /> Up to 100 attendees</li>
                            <li className="flex items-center gap-3 text-slate-300"><Zap className="w-5 h-5 text-slate-500" /> Standard registration forms</li>
                            <li className="flex items-center gap-3 text-slate-300"><Zap className="w-5 h-5 text-slate-500" /> Basic landing page</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl border border-slate-700 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm">Get Started</button>
                    </div>

                    {/* Tier 2 */}
                    <div className="bg-gradient-to-b from-fuchsia-900/20 to-slate-900 border border-fuchsia-500/30 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_50px_-12px_rgba(217,70,239,0.3)] font-mono">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-fuchsia-600 text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full">Most Popular</div>
                        <h3 className="text-xl font-bold text-fuchsia-400 mb-2 uppercase">Professional</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-black text-white">$299</span>
                            <span className="text-slate-400 font-sans">/event</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 pb-8 border-b border-slate-800 font-sans">For serious conferences needing a premium touch.</p>
                        <ul className="space-y-4 mb-8 flex-1 font-sans">
                            <li className="flex items-center gap-3 text-white"><Zap className="w-5 h-5 text-fuchsia-400" /> Up to 5,000 attendees</li>
                            <li className="flex items-center gap-3 text-white"><Zap className="w-5 h-5 text-fuchsia-400" /> AI Headshot Generator (YouCam)</li>
                            <li className="flex items-center gap-3 text-white"><Zap className="w-5 h-5 text-fuchsia-400" /> Foxit PDF Exports (Lanyards/Badges)</li>
                            <li className="flex items-center gap-3 text-white"><Zap className="w-5 h-5 text-fuchsia-400" /> Passwordless Attendee Login</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold transition-colors uppercase tracking-widest text-sm shadow-lg shadow-fuchsia-500/20">Start Free Trial</button>
                    </div>

                    {/* Tier 3 */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col font-mono">
                        <h3 className="text-xl font-bold text-slate-300 mb-2 uppercase">Enterprise</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-black text-white">Custom</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 pb-8 border-b border-slate-800 font-sans">For global expos and multi-day summits.</p>
                        <ul className="space-y-4 mb-8 flex-1 font-sans">
                            <li className="flex items-center gap-3 text-slate-300"><Zap className="w-5 h-5 text-purple-400" /> Unlimited attendees</li>
                            <li className="flex items-center gap-3 text-slate-300"><Zap className="w-5 h-5 text-purple-400" /> Custom branding & domains</li>
                            <li className="flex items-center gap-3 text-slate-300"><Zap className="w-5 h-5 text-purple-400" /> Dedicated Foxit/YouCam API quota</li>
                            <li className="flex items-center gap-3 text-slate-300"><Zap className="w-5 h-5 text-purple-400" /> 24/7 dedicated support</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl border border-slate-700 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm">Contact Sales</button>
                    </div>

                </div>
            </div>
        </div>
    );
}
