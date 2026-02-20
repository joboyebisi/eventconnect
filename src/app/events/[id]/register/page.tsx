"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, RefreshCw, CheckCircle, Upload } from 'lucide-react';

const compressImage = (file: File, maxWidth = 1000, maxHeight = 1000): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(newFile);
                        } else {
                            reject(new Error('Canvas to Blob failed'));
                        }
                    },
                    'image/jpeg',
                    0.8
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export default function RegisterPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    // Will fetch real event via API
    const [eventInfo, setEventInfo] = useState<any>(null);
    const [isLoadingEvent, setIsLoadingEvent] = useState(true);

    const [step, setStep] = useState(1); // 1 = Info, 2 = Photo/Upload, 3 = Generating, 4 = Review/Submit, 5 = Complete
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [finalImage, setFinalImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        company: "",
        linkedin: ""
    });

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                const event = data.find((e: any) => e.slug === eventId);
                setEventInfo(event);
                setIsLoadingEvent(false);
            })
            .catch(() => setIsLoadingEvent(false));
    }, [eventId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleGenerateHeadshot = async () => {
        if (!file) {
            setError("Please select a profile picture to enhance.");
            return;
        }
        setError(null);
        setIsGenerating(true);
        setStep(3); // Go to loading screen

        try {
            // Compress the file before sending over the network to avoid 413 Payload Too Large on Vercel/Next API limits
            let fileToUpload = file;
            try {
                fileToUpload = await compressImage(file, 1024, 1024);
                console.log("Compressed file to", Math.round(fileToUpload.size / 1024), "KB");
            } catch (e) {
                console.warn("Image compression failed, proceeding with original file", e);
            }

            const fd = new FormData();
            fd.append("file", fileToUpload);

            const uploadRes = await fetch("/api/youcam/upload", { method: "POST", body: fd });
            const uploadText = await uploadRes.text();

            let uploadData;
            try {
                uploadData = JSON.parse(uploadText);
            } catch (e) {
                if (uploadRes.status === 413) {
                    throw new Error("Image file is too large. Please upload a smaller image.");
                }
                throw new Error(`Upload failed. Server responded with: ${uploadText.slice(0, 50)}...`);
            }

            if (!uploadRes.ok) throw new Error(uploadData.error || uploadData.details || "Upload failed");

            const genRes = await fetch("/api/youcam/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ file_id: uploadData.file_id })
            });
            const genData = await genRes.json();
            if (!genRes.ok) throw new Error(genData.error || genData.details || "Generation start failed");

            let status = "running";
            let waitTime = 0;
            let finalImgResult = null;

            while (status === "running") {
                await new Promise(r => setTimeout(r, 2000));
                waitTime += 2000;

                const statusRes = await fetch(`/api/youcam/status?task_id=${genData.task_id}`);
                const statusData = await statusRes.json();

                if (!statusRes.ok) throw new Error(statusData.error || "Status check failed");

                status = statusData.task_status;
                if (status === "success") {
                    finalImgResult = statusData.results?.images?.[0] || statusData.results?.image;
                } else if (status === "error") {
                    throw new Error(`YouCam task error: ${statusData.error}`);
                }

                if (waitTime > 60000) throw new Error("Task timed out.");
            }

            setFinalImage(finalImgResult || preview);
            // Go to review screen
            setStep(4);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            // Back to upload screen if it fails
            setStep(2);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRetry = () => {
        // Reset image states
        setFinalImage(null);
        setFile(null);
        setPreview(null);
        setStep(2); // Back to upload
    };

    const handleFinalSubmit = async () => {
        try {
            setError(null);
            const res = await fetch('/api/attendees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: eventInfo.id,
                    name: formData.name,
                    role: formData.role,
                    company: formData.company,
                    linkedin: formData.linkedin,
                    imageUrl: finalImage
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit profile.");
            setStep(5);
        } catch (e: any) {
            setError(e.message);
        }
    };

    if (isLoadingEvent) return <div className="text-center py-20">Loading event info...</div>;

    const shareText = `I'll be attending ${eventInfo?.title || 'this awesome event'}! Looking forward to connecting.`;
    const shareUrl = `https://eventconnect.app/events/${eventId}`;

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-10 pb-20 pt-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
                    Step {step === 5 ? 3 : step > 3 ? 3 : step} of 3
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
                    {step === 1 ? "Your Information" : step === 2 ? "Upload Photo" : step === 3 ? "Generating..." : step === 4 ? "Review Profile" : "Registration Complete"}
                </h1>
                <p className="text-slate-400">Join {eventInfo?.title || 'the event'} and create your AI Professional Profile.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                {/* STEP 1: Basic Information */}
                {step === 1 && (
                    <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="flex flex-col gap-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Role / Job Title</label>
                                <input required type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Product Manager" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                                <input required type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="TechCorp Inc." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">LinkedIn URL</label>
                                <input type="url" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/..." />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
                                Continue to Photo Upload <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 2: Photo Upload */}
                {step === 2 && (
                    <div className="flex flex-col gap-8 relative z-10 w-full max-w-xl mx-auto">
                        <div className="text-center">
                            <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Generate Your AI Headshot</h3>
                            <p className="text-slate-400 text-sm">Upload a simple selfie and our AI will convert it into a stunningly professional headshot for the attendee directory.</p>
                        </div>

                        <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-950/50 transition-colors relative h-64 group">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            {preview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={preview} alt="Preview" className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-contain rounded-xl shadow-lg" />
                            ) : (
                                <div className="text-center group-hover:scale-105 transition-transform">
                                    <Upload className="w-10 h-10 mx-auto text-blue-500 mb-3" />
                                    <span className="text-slate-300 font-medium block">Click to upload a clear selfie</span>
                                    <span className="text-slate-500 text-xs mt-2 block">JPG, PNG up to 10MB</span>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white px-4 py-2 transition-colors">
                                Back
                            </button>
                            <button
                                onClick={handleGenerateHeadshot}
                                disabled={!file}
                                className={`flex items-center gap-2 py-3 px-8 rounded-xl font-bold transition-all ${file ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                    }`}
                            >
                                Generate AI Profile
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Loading / Generating */}
                {step === 3 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
                        <svg className="animate-spin h-16 w-16 text-emerald-500 mb-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 mb-2 animate-pulse">
                            YouCam AI is working its magic...
                        </h3>
                        <p className="text-slate-400 max-w-sm">
                            We are enhancing your photo and generating a flawless professional studio headshot. This might take up to 20 seconds.
                        </p>
                    </div>
                )}

                {/* STEP 4: Review and Submit (WITH RETRY OPTION) */}
                {step === 4 && finalImage && (
                    <div className="flex flex-col gap-10 relative z-10 w-full max-w-2xl mx-auto items-center">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Review Your Profile</h3>
                            <p className="text-slate-400">If you don't love the generation, you can retry.</p>
                        </div>

                        {/* Interactive Profile Card Preview */}
                        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col sm:flex-row items-center gap-8">
                            <div className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-emerald-500 to-purple-500 shadow-xl flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={finalImage} alt="Generated Headshot" className="w-full h-full object-cover rounded-full border-4 border-slate-900 bg-slate-900" />
                            </div>

                            <div className="text-center sm:text-left">
                                <h4 className="text-2xl font-bold text-white">{formData.name}</h4>
                                <p className="text-emerald-400 font-medium my-1">{formData.role}</p>
                                <p className="text-slate-400">{formData.company}</p>
                                {formData.linkedin && <p className="text-xs text-blue-500 mt-2 truncate w-48">{formData.linkedin}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
                            <button
                                onClick={handleRetry}
                                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" /> Try Another Photo
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                            >
                                <CheckCircle className="w-5 h-5" /> Looks Great, Submit
                            </button>
                        </div>
                    </div>
                )}


                {/* STEP 5: Success & Social Share */}
                {step === 5 && finalImage && (
                    <div className="flex flex-col items-center text-center py-8 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-bold mb-8 border border-emerald-500/30">
                            <CheckCircle className="w-5 h-5" /> Registration Confirmed!
                        </div>

                        <div className="relative w-48 h-48 rounded-full mb-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={finalImage} alt="Generated Headshot" className="w-full h-full object-cover rounded-full shadow-2xl" />
                        </div>

                        <h2 className="text-3xl font-bold mb-2">Welcome aboard, {formData.name || "Attendee"}!</h2>
                        <p className="text-slate-400 mb-10 max-w-md">Your profile is live in the directory. Let your network know you're attending!</p>

                        <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
                            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/30 font-semibold px-6 py-3 rounded-xl transition-colors">
                                Share on X
                            </a>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30 font-semibold px-6 py-3 rounded-xl transition-colors">
                                Share on LinkedIn
                            </a>
                        </div>

                        <Link href={`/events/${eventId}/directory`} className="mt-12 text-slate-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
                            Continue to Attendee Directory &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
