import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, PlusCircle, Printer } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Ensure user is an admin or we just assume for MVP they can create events
    // Supabase handles users natively in auth.users, but we might want a public.users copy for relations
    // For now we will just query events associated with their auth.uid

    // Fetch events created by this admin
    const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
            id,
            slug,
            title,
            date,
            location,
            image,
            attendee_profiles(id)
        `)
        .eq('admin_id', user.id);

    const events = eventsData || [];

    return (
        <div className="max-w-6xl mx-auto py-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Organizer Dashboard</h1>
                    <p className="text-slate-400">Manage your premium events and attendees.</p>
                </div>
                <Link
                    href="/admin/events/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                >
                    <PlusCircle className="w-5 h-5" /> Create Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 text-slate-300 mb-2">
                        <Calendar className="w-5 h-5 text-blue-400" /> Total Events
                    </div>
                    <div className="text-4xl font-black text-white">{events.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 text-slate-300 mb-2">
                        <Users className="w-5 h-5 text-emerald-400" /> Total Attendees
                    </div>
                    <div className="text-4xl font-black text-white">{events.reduce((acc: number, ev: any) => acc + (ev.attendee_profiles?.length || 0), 0)}</div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Your Events</h2>

            {events.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl border-dashed">
                    <p className="text-slate-400 mb-4">You haven't created any events yet.</p>
                    <Link href="/admin/events/create" className="text-blue-400 font-medium hover:underline">
                        Create your first event &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event: any) => (
                        <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-blue-500/30 transition-colors">
                            <div className="aspect-video w-full bg-slate-800 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={event.image || '/fallback.jpg'} alt={event.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                                <p className="text-blue-400 text-sm mb-4">{event.date}</p>

                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                                    <Users className="w-4 h-4" /> {event.attendee_profiles?.length || 0} Attendees Registered
                                </div>

                                <div className="mt-auto flex flex-col gap-2">
                                    <Link
                                        href={`/events/${event.slug}`}
                                        className="w-full py-2 text-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                                    >
                                        View Public Page
                                    </Link>
                                    <Link
                                        href={`/admin/events/${event.id}/print`}
                                        className="w-full flex items-center justify-center gap-2 py-2 text-center rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 transition-colors"
                                    >
                                        <Printer className="w-4 h-4" /> Print Studio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
