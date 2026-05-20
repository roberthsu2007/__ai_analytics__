import { useState, useTransition } from "react";
import Header from "./components/Header";
import TemplateSelector from "./components/TemplateSelector";
import MeetingInput from "./components/MeetingInput";
import MeetingOutput from "./components/MeetingOutput";
import { MEETING_TEMPLATES } from "./data/templates";
import { 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Cpu, 
  History
} from "lucide-react";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [resultText, setResultText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ modelUsed: string; generatedAt: string } | undefined>(undefined);

  // Auto-track template selection in sync with raw typing
  const handleSelectTemplate = (text: string) => {
    setTranscript(text);
    const matched = MEETING_TEMPLATES.find((t) => t.transcript.trim() === text.trim());
    setActiveTemplateId(matched ? matched.id : null);
    setError(null); // Reset errors when swapping templates
  };

  const handleTranscriptChange = (text: string) => {
    setTranscript(text);
    setActiveTemplateId(null);
  };

  const handleAnalyze = async (config: {
    language: string;
    style: string;
    focus: string[];
    customInstruction: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setResultText("");

    try {
      const response = await fetch("/api/meetings/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          language: config.language,
          style: config.style,
          focus: config.focus,
          customInstruction: config.customInstruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "在聯繫 AI 會議解析引擎時發生問題。請檢查右上角「Settings > Secrets」之中是否已正確配置您的 GEMINI_API_KEY。"
        );
      }

      if (data.success) {
        setResultText(data.resultText);
        setMetadata({
          modelUsed: data.modelUsed,
          generatedAt: data.generatedAt,
        });
      } else {
        throw new Error("伺服器未能成功處理此次會議逐字稿。");
      }
    } catch (err: any) {
      console.error("API Call failed:", err);
      setError(err.message || "發生未知連線錯誤。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col font-sans text-stone-800">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner with humble explanation, styled with warm Natural Tones */}
        <div className="bg-[#5A5A40] rounded-3xl text-[#FDFDFB] p-6 sm:p-8 relative overflow-hidden shadow-md shadow-stone-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl translate-x-10 -translate-y-10" />
          <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-stone-100/10 rounded-full blur-xl" />

          <div className="relative z-10 max-w-3xl space-y-3.5">
            <span className="inline-flex items-center px-3 py-1 bg-white/10 text-stone-100 text-xs font-semibold rounded-full backdrop-blur-md">
              ✨ 暖木質感 &amp; 智慧 3.5 節能引擎
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              告別繁瑣口水話，一鍵生成精華會議紀錄與同聲傳譯
            </h2>
            <p className="text-sm text-stone-200/90 font-medium leading-relaxed">
              支持貼上高達二萬字的各類線上口語逐字稿。由 AI 精準識別跨部門團隊爭執、歸納重點決議、安排時間節點、並將內容流暢翻譯。為您的每日非同步協作帶來質的飛躍。
            </p>
          </div>
        </div>

        {/* Meeting transcript pre-made templates */}
        <TemplateSelector 
          onSelect={handleSelectTemplate} 
          activeTemplateId={activeTemplateId} 
        />

        {/* Global Error Notice Section */}
        {error && (
          <div className="bg-red-50 border border-red-150 rounded-2xl p-5 flex items-start space-x-3 shadow-sm">
            <AlertCircle className="w-5.5 h-5.5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">偵測到模組連線異常</h4>
              <p className="text-xs text-red-650 mt-1 leading-relaxed">
                {error}
              </p>
              <div className="mt-2.5 flex items-center space-x-3">
                <span className="text-xs text-red-750 font-semibold bg-red-100/60 px-2 py-0.5 rounded">
                  貼心建議：
                </span>
                <span className="text-xs text-red-650">
                  請點擊編輯器右上角 <span className="font-bold">Settings &gt; Secrets</span>，添加一筆值為您的 Gemini API 金鑰的環境變數 <span className="font-mono bg-red-105/80 px-1 rounded font-bold">GEMINI_API_KEY</span> 即可完美排除！
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Primary Interactive Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input control panel */}
          <div className="space-y-6">
            <MeetingInput
              transcript={transcript}
              setTranscript={handleTranscriptChange}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
            />
          </div>

          {/* Result view panel */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <MeetingOutput
              resultText={resultText}
              isLoading={isLoading}
              metadata={metadata}
            />
          </div>
        </div>

        {/* Features Bento cards - Proportional decoration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 flex items-start space-x-3.5">
            <div className="p-2.5 bg-stone-100 text-[#5A5A40] rounded-xl font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">智慧重點梳理</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                過濾口哨與無謂寒暄字詞，直接還原最核心的對話決議，不漏細節。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 flex items-start space-x-3.5">
            <div className="p-2.5 bg-stone-100 text-[#5A5A40] rounded-xl font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">精確待辦指派</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                自動提取 Action Items，細緻定位發言人職責，追蹤效率立增。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 flex items-start space-x-3.5">
            <div className="p-2.5 bg-stone-100 text-[#5A5A40] rounded-xl font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">多語同步編譯</h4>
              <p className="text-xs text-gray-450 leading-relaxed">
                支持七國主流語系流暢翻譯與精簡輸出，克服跨國通訊障礙。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 border-t border-stone-200/85 py-6 mt-16 text-center text-[11px] text-stone-500 font-medium">
        鼎鼎會議 AI 總結與翻譯官 © {new Date().getFullYear()} • 釋放跨組溝通無限價值 • 暖木主題風格佈局
      </footer>
    </div>
  );
}
