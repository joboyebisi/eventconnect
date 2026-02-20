"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer, RefreshCw, LayoutTemplate, Settings2, Download } from "lucide-react";

export default function PrintStudioPage() {
    const params = useParams();
    const eventId = params.id as string;

    const [eventData, setEventData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Interactive PDF State
    const [printType, setPrintType] = useState<"lanyards" | "programme">("lanyards");
    const [includeCompany, setIncludeCompany] = useState(true);
    const [includeRole, setIncludeRole] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        // Fetch event + attendees
        const fetchDb = async () => {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                const event = data.find((e: any) => e.id === eventId);
                setEventData(event);
            } catch (e) { } finally { setIsLoading(false); }
        };
        fetchDb();
    }, [eventId]);

    const handleGeneratePdf = async () => {
        setIsGeneratingPdf(true);
        setPdfUrl(null);

        try {
            // Construct HTML to send to Foxit Node endpoint
            let htmlPayload = "";

            if (printType === "lanyards") {
                // 3x4 Grid for Lanyards
                const lanyardsHtml = eventData.attendees.map((att: any) => `
                <div style="width: 3.5in; height: 2.2in; border: 1px solid #ccc; margin: 10px; display: inline-block; text-align: center; font-family: sans-serif; box-sizing: border-box; padding: 20px;">
                    <h2 style="margin: 0 0 10px 0; color: #1e40af; font-size: 24px;">${att.name}</h2>
                    ${includeRole ? `<p style="margin: 5px 0; color: #374151; font-size: 16px;">${att.role}</p>` : ''}
                    ${includeCompany ? `<p style="margin: 5px 0; color: #6b7280; font-size: 14px;">${att.company}</p>` : ''}
                    <div style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-transform: uppercase;">${eventData.title}</div>
                </div>
              `).join("");

                htmlPayload = `
                <html>
                  <head><title>Lanyards</title></head>
                  <body style="margin: 0; padding: 20px;">
                    <div style="display: flex; flex-wrap: wrap;">
                      ${lanyardsHtml}
                    </div>
                  </body>
                </html>
              `;
            } else {
                // Standard A4 Programme
                htmlPayload = `
                <html>
                  <head>
                    <title>Event Programme</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; color: #111827; }
                        h1 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
                        .info { margin-bottom: 30px; color: #4b5563; }
                        .content { line-height: 1.6; }
                    </style>
                  </head>
                  <body>
                    <h1>${eventData.title}</h1>
                    <div class="info">
                        <p><strong>Date:</strong> ${eventData.date}</p>
                        <p><strong>Location:</strong> ${eventData.location}</p>
                    </div>
                    <div class="content">
                        ${eventData.frontPageHtml || '<p>No specific html programme provided.</p>'}
                    </div>
                  </body>
                </html>
              `;
            }

            const res = await fetch("/api/foxit/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html: htmlPayload })
            });

            if (!res.ok) throw new Error("Failed to generate PDF");

            // Foxit backend returns a URL or base64
            const data = await res.json();
            setPdfUrl(data.pdfUrl); // Assume base64 data URI or signed URL for now
        } catch (e) {
            alert("Error generating PDF via Foxit API. Check console.");
            console.error(e);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading Print Studio...</div>;
    if (!eventData) return <div className="text-center py-20">Event not found.</div>;

    return (
        <div className="max-w-6xl mx-auto py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <Printer className="text-emerald-400" /> Interactive Print Studio
                </h1>
                <p className="text-slate-400">Design and generate physical assets powered by Foxit PDF Editor Cloud.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Settings Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                            <Settings2 className="w-5 h-5" /> Document Settings
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Document Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPrintType("lanyards")}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${printType === "lanyards" ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"}`}
                                    >
                                        <Users className="w-5 h-5" /> Name Badges
                                    </button>
                                    <button
                                        onClick={() => setPrintType("programme")}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${printType === "programme" ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"}`}
                                    >
                                        <LayoutTemplate className="w-5 h-5" /> Programme
                                    </button>
                                </div>
                            </div>

                            {printType === "lanyards" && (
                                <div className="space-y-3 pt-4 border-t border-slate-800">
                                    <label className="block text-sm font-medium text-slate-300">Data to Include</label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={includeRole} onChange={(e) => setIncludeRole(e.target.checked)} className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                                        <span className="text-slate-300">Job Title / Role</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={includeCompany} onChange={(e) => setIncludeCompany(e.target.checked)} className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                                        <span className="text-slate-300">Company Name</span>
                                    </label>
                                </div>
                            )}

                            <button
                                onClick={handleGeneratePdf}
                                disabled={isGeneratingPdf}
                                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {isGeneratingPdf ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />}
                                {isGeneratingPdf ? "Generating via Foxit..." : "Generate PDF"}
                            </button>

                            {pdfUrl && (
                                <a
                                    href={pdfUrl}
                                    download={`${eventData.slug}-${printType}.pdf`}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    <Download className="w-4 h-4" /> Download Final PDF
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live HTML Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-100 rounded-3xl p-8 min-h-[600px] shadow-inner text-slate-900 overflow-auto">
                        <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span>Live HTML Preview</span>
                            <span className="text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Scale: 100%</span>
                        </div>

                        {/* Preview Rendering Box */}
                        <div className="bg-white shadow-xl rounded min-h-[500px] p-8">
                            {printType === "lanyards" ? (
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {eventData.attendees.length > 0 ? eventData.attendees.slice(0, 6).map((att: any, i: number) => (
                                        <div key={i} className="w-[3.5in] h-[2.2in] border border-slate-300 p-6 flex flex-col items-center justify-center text-center">
                                            <h2 className="text-2xl font-bold text-blue-900 mb-2">{att.name}</h2>
                                            {includeRole && <p className="text-slate-700 font-medium">{att.role}</p>}
                                            {includeCompany && <p className="text-slate-500 text-sm">{att.company}</p>}
                                            <div className="mt-4 text-xs font-bold text-slate-400 uppercase">{eventData.title}</div>
                                        </div>
                                    )) : (
                                        <div className="text-slate-400">No attendees to preview.</div>
                                    )}
                                    {eventData.attendees.length > 6 && <div className="w-full text-center text-slate-400 mt-4">+ {eventData.attendees.length - 6} more badges...</div>}
                                </div>
                            ) : (
                                <div className="max-w-2xl mx-auto">
                                    <h1 className="text-3xl font-bold text-blue-700 border-b-2 border-slate-200 pb-4 mb-8">{eventData.title}</h1>
                                    <div className="mb-8 text-slate-600">
                                        <p><strong>Date:</strong> {eventData.date}</p>
                                        <p><strong>Location:</strong> {eventData.location}</p>
                                    </div>
                                    <div
                                        className="prose prose-slate"
                                        dangerouslySetInnerHTML={{ __html: eventData.frontPageHtml || '<p>No specific html programme provided.</p>' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Needed missing icons fix at top
import { Users } from "lucide-react";
