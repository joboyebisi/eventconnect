"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, AlignLeft, Image as ImageIcon } from "lucide-react";

export default function CreateEvent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        date: "",
        location: "",
        aboutText: "",
        image: "",
        frontPageHtml: `<div class="schedule-block">
  <h4>09:00 AM - Registration & Breakfast</h4>
  <p>Main Lobby</p>
</div>
<div class="schedule-block">
  <h4>10:00 AM - Opening Keynote</h4>
  <p>Stage A - "The Future of AI"</p>
</div>
<div class="schedule-block">
  <h4>12:00 PM - Networking Lunch</h4>
  <p>Expo Hall</p>
</div>`
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                alert("Failed to create event");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
            <p className="text-slate-400 mb-10">Set up the bespoke landing page and configuration for your event.</p>

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. DeveloperWeek 2026" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">URL Slug</label>
                        <div className="flex items-center">
                            <span className="bg-slate-800 text-slate-400 px-4 py-3 rounded-l-xl border border-r-0 border-slate-700/50">/events/</span>
                            <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-r-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="developerweek" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</label>
                        <input required type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Oct 15-17, 2026" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</label>
                        <input required type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="San Francisco, CA" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Header Image URL</label>
                        <input required type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://images.unsplash.com/..." />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-4">Event Details & HTML</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><AlignLeft className="w-4 h-4" /> About Description (Used on Landing Page)</label>
                            <textarea required rows={3} value={formData.aboutText} onChange={e => setFormData({ ...formData, aboutText: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Write a short pitch..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Front Page HTML (Used for PDF Documents & Extended Profile)</label>
                            <textarea required rows={6} value={formData.frontPageHtml} onChange={e => setFormData({ ...formData, frontPageHtml: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-blue-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="<h1>Title</h1>" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating..." : "Save Event"}
                    </button>
                </div>
            </form>
        </div>
    );
}
