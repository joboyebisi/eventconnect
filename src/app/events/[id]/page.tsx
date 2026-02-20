import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
// Mock attendees
const ATTENDEES = [
    { id: 1, name: "Alice Johnson", role: "Software Engineer", company: "TechCorp", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop" },
    { id: 2, name: "Michael Chen", role: "Product Manager", company: "Innovate Inc", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop" },
    { id: 3, name: "Sarah Davis", role: "UX Designer", company: "DesignStudio", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop" },
    { id: 4, name: "David Wilson", role: "Data Scientist", company: "DataAI", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop" },
];

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const awaitedParams = await params;

    const supabase = await createClient();
    const { data: event, error } = await supabase
        .from('events')
        .select(`
            *,
            attendee_profiles(*)
        `)
        .eq('slug', awaitedParams.id)
        .single();
    if (!event) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-12 pb-20">
            {/* Event Header */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-800 border border-white/10 shadow-2xl">
                <div className="aspect-[21/9] w-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.image || '/fallback.jpg'} alt={event.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-4 backdrop-blur-md border border-blue-500/30">
                                Conference
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
                            <div className="flex flex-wrap gap-6 text-slate-300 text-base md:text-lg">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    {event.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    {event.location}
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/events/${awaitedParams.id}/register`}
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-4 w-12"></div>
                            Register & Create AI Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About this event</h2>
                        <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
                            <p>{event.aboutText}</p>

                            <div dangerouslySetInnerHTML={{ __html: event.frontPageHtml || '' }} className="mt-8" />

                            <p className="mt-8">
                                <strong>Bonus:</strong> When you register, you'll get access to our AI Profile Generator powered by YouCam, helping you create a stunning professional headshot for the attendee directory!
                            </p>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Location</h3>
                        <div className="aspect-video w-full rounded-xl bg-slate-700/50 mb-4 flex items-center justify-center border border-white/5 relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                            <div className="absolute flex flex-col items-center">
                                <svg className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm">
                            Main Convention Center<br />
                            {event.location}
                        </p>
                    </div>
                </div>
            </div>

            {/* Networking / Attendees Section */}
            <section className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Who's Attending</h2>
                        <p className="text-slate-400 mt-2">Connect with {event.attendee_profiles?.length > 0 ? event.attendee_profiles?.length : '1000'}+ professionals. Generate your AI headshot to join the directory!</p>                    </div>
                    <Link href={`/events/${awaitedParams.id}/directory`} className="text-blue-400 hover:text-blue-300 font-medium hidden sm:block">
                        View full directory &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {ATTENDEES.map(attendee => (
                        <div key={attendee.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 hover:bg-slate-800 transition-colors group text-center flex flex-col">
                            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={attendee.image} alt={attendee.name} className="w-full h-full object-cover rounded-full border-2 border-slate-900" />
                            </div>
                            <h3 className="font-bold text-white">{attendee.name}</h3>
                            <p className="text-sm text-blue-400 mb-1">{attendee.role}</p>
                            <p className="text-xs text-slate-400">{attendee.company}</p>

                            <button className="mt-auto w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5">
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
