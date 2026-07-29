export function LiveExtractionFeed() {
    return (
        <div className="w-full h-full bg-[#09090b] font-mono text-xs flex flex-col relative overflow-hidden text-zinc-300">
            <div className="flex-1 p-5 flex flex-col gap-2.5">
                <div className="animate-terminal-1 flex gap-3">
                    <span className="text-emerald-400 font-medium shrink-0">[CRAWL_INIT]</span>
                    <span className="text-zinc-400">Booting SEO Audit Engine v4.0...</span>
                </div>
                
                <div className="animate-terminal-2 flex gap-3">
                    <span className="text-cyan-400 font-medium shrink-0">[CONFIG]</span>
                    <span className="text-zinc-400">Loaded 249 audit rules across 16 categories. <span className="text-emerald-400">Ready</span></span>
                </div>
                
                <div className="animate-terminal-3 flex gap-3">
                    <span className="text-zinc-200 font-medium shrink-0">[DISPATCH]</span>
                    <span className="text-zinc-100">Target URL: <span className="text-zinc-400 font-semibold">https://example-domain.com</span></span>
                </div>
                
                <div className="animate-terminal-4 flex gap-3">
                    <span className="text-amber-400 font-medium shrink-0">[HEADLESS]</span>
                    <span className="text-zinc-400">JS execution required. Launching Playwright Chromium...</span>
                </div>
                
                <div className="animate-terminal-5 flex gap-3">
                    <span className="text-emerald-400 font-medium shrink-0">[PARSING]</span>
                    <span className="text-zinc-400">Evaluating Canonical, OpenGraph, JSON-LD & Core Web Vitals... <span className="text-zinc-200">(0.38s)</span></span>
                </div>
                
                <div className="animate-terminal-6 flex gap-3">
                    <span className="text-cyan-400 font-medium shrink-0">[CONTACTS]</span>
                    <span className="text-zinc-400">Scanning page tree for verified public contact metadata...</span>
                </div>
                
                <div className="animate-terminal-7 flex flex-col gap-1.5 ml-6 mt-1 border-l border-zinc-800 pl-4 py-1 text-[11px]">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-400 text-xs">check_circle</span>
                        <span className="text-zinc-300">Extracted: contact@example-domain.com (Mailto confirmed)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-400 text-xs">check_circle</span>
                        <span className="text-zinc-300">Extracted: +1 (800) 555-0199 (Tel: link verified)</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                        <span className="material-symbols-outlined text-xs">hourglass_top</span>
                        <span>Compiling final diagnostic report...</span>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none"></div>
        </div>
    );
}
