export function LiveExtractionFeed() {
    return (
        <div className="w-full h-full bg-[#050505] font-mono text-xs md:text-sm flex flex-col relative overflow-hidden">
            <div className="flex-1 p-5 flex flex-col gap-3">
                <div className="animate-terminal-1 flex gap-3">
                    <span className="text-cyan-flare shrink-0">[SYS_INIT]</span>
                    <span className="text-slate-text">Booting Neural Crawling Framework v4.0.2...</span>
                </div>
                
                <div className="animate-terminal-2 flex gap-3">
                    <span className="text-vibrant-violet shrink-0">[AI_BRAIN]</span>
                    <span className="text-slate-text">Loading Multi-Armed Bandit RL Model... <span className="text-electric-indigo">Online</span></span>
                </div>
                
                <div className="animate-terminal-3 flex gap-3">
                    <span className="text-cyan-flare shrink-0">[DISPATCH]</span>
                    <span className="text-white">Target acquired: <span className="text-slate-400">enterprise-client.com</span></span>
                </div>
                
                <div className="animate-terminal-4 flex gap-3">
                    <span className="text-error shrink-0">[WARN_WAF]</span>
                    <span className="text-slate-text">Cloudflare IUAM challenge detected on edge network.</span>
                </div>
                
                <div className="animate-terminal-5 flex gap-3">
                    <span className="text-electric-indigo shrink-0">[STEALTH]</span>
                    <span className="text-slate-text">Deploying headless Playwright workers... <span className="text-primary">Bypassed (0.42s)</span></span>
                </div>
                
                <div className="animate-terminal-6 flex gap-3">
                    <span className="text-primary shrink-0">[LLM_EXTR]</span>
                    <span className="text-slate-text">Parsing DOM for unlinked PII and structural semantic assets...</span>
                </div>
                
                <div className="animate-terminal-7 flex flex-col gap-2 ml-7 mt-1 border-l border-white/10 pl-4 py-1">
                    <div className="flex gap-2">
                        <span className="text-success material-symbols-outlined text-sm">check_circle</span>
                        <span className="text-slate-300">Extracted: ceo@enterprise-client.com (Confidence: 99.8%)</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-success material-symbols-outlined text-sm">check_circle</span>
                        <span className="text-slate-300">Extracted: /hidden-staging-api/v2/users (Leaked endpoint)</span>
                    </div>
                    <div className="flex gap-2 text-cyan-flare animate-pulse">
                        <span className="text-cyan-flare material-symbols-outlined text-sm">hourglass_empty</span>
                        <span>Compiling forensic audit report...</span>
                    </div>
                </div>
            </div>
            
            {/* Fade out bottom overlay to keep it clean */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
        </div>
    );
}
