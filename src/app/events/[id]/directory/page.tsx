import Link from 'next/link';
import { notFound } from 'next/navigation';
const DIRECTORY = [
    { id: 1, name: "Alice Johnson", role: "Software Engineer", company: "TechCorp", linkedin: "#", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop" },
    { id: 2, name: "Michael Chen", role: "Product Manager", company: "Innovate Inc", linkedin: "#", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop" },
    { id: 3, name: "Sarah Davis", role: "UX Designer", company: "DesignStudio", linkedin: "#", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop" },
    { id: 4, name: "David Wilson", role: "Data Scientist", company: "DataAI", linkedin: "#", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop" },
    { id: 5, name: "Emma Thompson", role: "CTO", company: "NextGen Tech", linkedin: "#", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop" },
    { id: 6, name: "James Rodriguez", role: "VP of Engineering", company: "CloudSys", linkedin: "#", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&auto=format&fit=crop" },
];

export default async function DirectoryPage({ params }: { params: Promise<{ id: string }> }) {
    const awaitedParams = await params;

    // Mock event representing actual data query for later
    const event = { title: "Global Developer Event", attendees: 1000, slug: awaitedParams.id };

    if (!event) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 pt-8">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link href={`/events/${awaitedParams.id}`} className="text-blue-400 hover:text-blue-300 font-medium mb-4 inline-block hover:underline underline-offset-4">&larr; Back to Event</Link>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        Attendee Directory
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Connect with {event.attendees}+ professionals at {event.title}
                    </p>
                </div>

                {/* Search / Filter */}
                <div className="w-full md:w-72">
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input
                            type="text"
                            placeholder="Search directory..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {DIRECTORY.map(attendee => (
                    <div key={attendee.id} className="bg-slate-800/40 border border-white/5 rounded-3xl p-6 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10 group flex flex-col">
                        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-500 shadow-xl flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={attendee.image} alt={attendee.name} className="w-full h-full object-cover rounded-full border-4 border-slate-900 bg-slate-900" />
                        </div>

                        <div className="text-center flex-grow">
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{attendee.name}</h3>
                            <p className="text-sm font-medium text-blue-400 mb-1">{attendee.role}</p>
                            <p className="text-xs text-slate-400 mb-4">{attendee.company}</p>
                        </div>

                        <div className="flex gap-2 mt-auto pt-4 border-t border-white/10">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-xl text-sm transition-colors">
                                Connect
                            </button>
                            <a href={attendee.linkedin} className="flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white w-10 h-10 rounded-xl transition-colors shrink-0">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
