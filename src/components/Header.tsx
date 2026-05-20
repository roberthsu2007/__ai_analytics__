import { Sparkles, Languages } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#5A5A40] rounded-xl text-white shadow-md shadow-stone-250">
            <Sparkles className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-850 tracking-tight flex items-center gap-2">
              鼎鼎會議 AI 總結與翻譯官
              <span className="text-stone-400 font-normal text-xs ml-1">v2.4.0</span>
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              基於 Gemini 3.5 智慧引擎 • 自然暖調風格、重點精確提取
            </p>
          </div>
        </div>

        {/* Status indicator - Real status, humble but useful */}
        <div className="flex items-center space-x-2 bg-stone-100 px-3.5 py-1.5 rounded-full border border-stone-200 text-xs">
          <Languages className="w-4 h-4 text-[#5A5A40]" />
          <span className="text-stone-605 font-semibold">即時外語翻譯對接</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-650 animate-ping"></span>
        </div>
      </div>
    </header>
  );
}
