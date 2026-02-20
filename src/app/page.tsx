import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { MapPin, Monitor, Printer, Sparkles, Layout, ArrowRight, Terminal, ChevronRight, Star } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();

  // Fetch Spotlight event (DeveloperWeek)
  const { data: event } = await supabase
    .from('events')
    .select('*, attendee_profiles(*)')
    .eq('slug', 'developerweek')
    .single();

  const attendees = event?.attendee_profiles || [];
  const displayAttendees = attendees.slice(0, 6); // Show top 6 attendees

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-fuchsia-500/30">

      {/* 
        ========================================================
        HERO SECTION - 706_NETWORK THEME
        ========================================================
      */}
      <section className="relative pt-32 pb-40 overflow-hidden border-b border-fuchsia-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-950 to-black -z-10"></div>
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 backdrop-blur-sm text-sm text-fuchsia-300 mb-8 lowercase tracking-widest font-mono">
            <Terminal className="w-4 h-4" />
            <span className="font-bold">v2.0.0_BETA</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 font-mono uppercase relative group">
            <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-30 group-hover:opacity-60 transition-opacity duration-1000"></span>
            <span className="relative text-white">THE OS FOR</span><br />
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-400 animate-pulse">TECH EVENTS</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mb-12 leading-relaxed">
            Launch, scale, and connect your developer community with the world&apos;s most advanced event SaaS platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-16 justify-center w-full max-w-2xl font-mono">
            <Link
              href="#spotlight"
              className="group relative flex items-center justify-center px-8 py-5 text-lg font-black tracking-widest uppercase text-slate-900 bg-fuchsia-400 rounded-xl hover:bg-fuchsia-300 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(232,121,249,0.5)] w-full sm:w-auto"
            >
              Find Events
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center px-8 py-5 text-lg font-bold tracking-widest uppercase text-white border border-slate-700 bg-slate-900/50 rounded-xl hover:bg-slate-800 hover:border-fuchsia-500/50 transition-colors w-full sm:w-auto"
            >
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* 
        ========================================================
        SPOTLIGHT EVENT SECTION
        ========================================================
      */}
      <section id="spotlight" className="py-32 relative bg-slate-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
                </span>
                <h2 className="text-fuchsia-400 font-mono tracking-widest uppercase text-sm font-bold">Featured Spotlight</h2>
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase font-mono tracking-tighter">
                #{event?.slug ? event.slug.toUpperCase() : 'DEVELOPERWEEK'}
              </h3>
            </div>
            {event && (
              <Link href={`/events/${event.slug}`} className="text-fuchsia-400 hover:text-fuchsia-300 flex items-center font-mono text-sm tracking-widest uppercase font-bold group">
                View Event Info <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {event && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Event Image & Details */}
              <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-800 relative group flex flex-col justify-end min-h-[400px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&fit=crop'} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

                <div className="relative z-10 p-8">
                  <h4 className="text-3xl font-bold text-white mb-4">{event.title}</h4>
                  <div className="flex flex-wrap gap-6 text-slate-300 mb-6 font-mono text-sm">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-fuchsia-400" /> {event.location}</div>
                    <div className="flex items-center gap-2"><Monitor className="w-4 h-4 text-purple-400" /> {event.date}</div>
                  </div>
                  <p className="text-slate-400 max-w-xl">{event.aboutText}</p>
                </div>
              </div>

              {/* Networking & Attendees */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>

                <div>
                  <h4 className="text-xl font-bold text-white mb-2 font-mono uppercase">See Who&apos;s Attending</h4>
                  <p className="text-slate-400 mb-8 leading-relaxed">Connect with {attendees.length > 0 ? `${attendees.length}+` : 'hundreds of'} engineers, founders, and investors before the event begins.</p>

                  {displayAttendees.length > 0 ? (
                    <div className="flex flex-wrap gap-4 mb-8">
                      {displayAttendees.map((a: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-full pr-4 p-1 hover:border-fuchsia-500/30 transition-colors w-full sm:w-[calc(50%-0.5rem)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.headshot_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&fit=crop'} alt={a.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-800" />
                          <div className="overflow-hidden">
                            <div className="text-sm font-bold text-white truncate">{a.name}</div>
                            <div className="text-xs text-slate-500 truncate">{a.company}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 italic mb-8">Attendees will appear here.</div>
                  )}
                </div>

                <Link
                  href={`/events/${event.slug}/register`}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black font-mono tracking-widest uppercase bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white transition-all shadow-lg hover:shadow-fuchsia-500/25"
                >
                  Register to Connect <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 
        ========================================================
        FEATURES SECTION - MARKETING TO ORGANIZERS
        ========================================================
      */}
      <section className="py-32 relative bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter font-mono">
              The Engine Powering <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">World-Class Tech Events.</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              We provide organizers with bleeding-edge tools to generate AI profiles, instantly produce physical collateral, and manage attendees seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-3xl bg-slate-900 p-8 border border-slate-800 hover:border-fuchsia-500/50 transition-colors">
              <div className="w-14 h-14 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-fuchsia-500/20 transition-colors">
                <Sparkles className="w-7 h-7 text-fuchsia-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-mono uppercase">AI Attendee Profiles</h3>
              <p className="text-slate-400 leading-relaxed">
                Elevate your attendee directory. Our integration with YouCam AI generates stunning, professional studio headshots from simple selfies directly during registration.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-3xl bg-slate-900 p-8 border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500/20 transition-colors">
                <Printer className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-mono uppercase">Foxit PDF Studio</h3>
              <p className="text-slate-400 leading-relaxed">
                Powered by Foxit Cloud PDF API. Interactively design lanyards, schedules, and hardcover programmes, and export perfectly formatted, high-quality PDFs instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-3xl bg-slate-900 p-8 border border-slate-800 hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-500/20 transition-colors">
                <Layout className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-mono uppercase">Bespoke Event Pages</h3>
              <p className="text-slate-400 leading-relaxed">
                Build beautiful, immersive landing pages. Customize headlines, schedules, tracks, and directories to match your community&apos;s exact aesthetic.
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-black tracking-widest uppercase text-slate-900 bg-white rounded-xl hover:bg-slate-200 transition-all duration-300 font-mono"
            >
              Create Your Own Event <ArrowRight className="w-5 h-5 ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 
        ========================================================
        TESTIMONIALS SECTION
        ========================================================
      */}
      <section className="py-32 relative border-t border-slate-800 bg-slate-950">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-fuchsia-900/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4 font-mono tracking-tighter uppercase">Trusted by Top Organizers</h2>
            <p className="text-xl text-slate-400">Hear from the teams building the next generation of tech conferences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col">
                <div className="flex gap-1 mb-6">
                  <Star className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500" />
                  <Star className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500" />
                  <Star className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500" />
                  <Star className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500" />
                  <Star className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500" />
                </div>
                <p className="text-slate-300 italic mb-8 flex-1 leading-relaxed">
                  &quot;706_NETWORK completely changed how we handle attendee networking. The AI headshots made our directory look insanely professional, and printing lanyards with Foxit saved us hours.&quot;
                </p>
                <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-500 p-0.5">
                    <div className="w-full h-full bg-slate-900 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-mono">Alex Mercer</h4>
                    <p className="text-sm text-slate-500 font-mono">Lead Organizer, DevCon</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================
        FOOTER
        ========================================================
      */}
      <footer className="bg-black py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-500 font-mono mb-2">
              706_NETWORK
            </Link>
            <p className="text-slate-500 text-sm">© 2026 706 Network Inc. All rights reserved.</p>
          </div>

          <div className="flex font-mono text-sm tracking-widest uppercase gap-8 text-slate-400">
            <Link href="/pricing" className="hover:text-fuchsia-400 transition-colors">Pricing</Link>
            <Link href="/terms" className="hover:text-fuchsia-400 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-fuchsia-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
