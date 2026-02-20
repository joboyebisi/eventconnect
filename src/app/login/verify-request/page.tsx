export default function VerifyRequest() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                Check your email
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
                A sign in link has been sent to your email address. Click the link to log into your account.
            </p>
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400/80 text-sm max-w-sm font-mono">
                Note: If testing locally with Ethereal, check your terminal console for the Magic Link URL!
            </div>
        </div>
    )
}
