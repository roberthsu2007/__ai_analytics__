import { useState } from "react";
import Markdown from "react-markdown";
import { 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Clock, 
  FileText, 
  BrainCircuit 
} from "lucide-react";

interface MeetingOutputProps {
  resultText: string;
  isLoading: boolean;
  metadata?: {
    modelUsed: string;
    generatedAt: string;
  };
}

export default function MeetingOutput({ resultText, isLoading, metadata }: MeetingOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("複製失敗:", err);
    }
  };

  const handleDownload = () => {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AI會議記錄_${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Pre-configured custom styled tags for beautiful markdown elements within lists/tables
  const renderers = {
    h1: ({ children }: any) => (
      <h1 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-3 mt-8 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#5A5A40] shrink-0" />
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-md font-bold text-stone-850 mt-6 mb-3 flex items-center gap-2 border-l-4 border-[#5A5A40] pl-3.5">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-sm font-bold text-stone-800 mt-5 mb-2.5">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-sm leading-relaxed text-stone-605 mb-4 font-sans">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-6 space-y-2 mb-4 text-sm text-stone-605 marker:text-[#5A5A40]">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-6 space-y-2 mb-4 text-sm text-stone-605 marker:text-stone-705">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="pl-0.5 leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-stone-400 pl-4 py-2 bg-stone-50 text-stone-550 italic rounded-r-xl my-5">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-6 border border-stone-200 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-stone-50 border-b border-stone-200">{children}</thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-stone-100">{children}</tbody>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-3 font-bold text-stone-700 text-xs bg-stone-50/50">{children}</th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-3 text-stone-605 text-xs leading-relaxed">{children}</td>
    ),
    code: ({ children }: any) => (
      <code className="bg-stone-50 text-[#5A5A40] font-mono text-xs px-1.5 py-0.5 rounded-md border border-stone-200">{children}</code>
    ),
  };

  if (!resultText) {
    return (
      <div className="bg-[#FDFDFB] rounded-3xl border border-stone-200 shadow-sm p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Soft natural toned layout details */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-stone-100 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F5F5F0]/30 rounded-full blur-3xl -z-10" />

        <div className="p-4 bg-stone-100 text-[#5A5A40] rounded-2xl mb-4 shadow-sm animate-bounce">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h3 className="text-md font-bold text-stone-900 mb-2">等候 AI 會議秘書大顯身手</h3>
        <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
          請在左側貼上您的會議記錄，或是直接選擇上方的體驗範本匯入，點擊下面「生成總結與翻譯」按鈕，精準報告與翻譯將在此完美亮相。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFDFB] rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5 antialiased">
      {/* Header controls for output */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-150">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#5A5A40] animate-pulse" />
            <span>AI 生成會議報告與翻譯結果</span>
          </h3>
          {metadata && (
            <div className="flex items-center space-x-3.5 text-xs text-stone-400 mt-1 font-mono">
              <span className="flex items-center space-x-1">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>模型: {metadata.modelUsed}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>產出時間: {new Date(metadata.generatedAt).toLocaleTimeString("zh-TW")}</span>
              </span>
            </div>
          )}
        </div>

        {/* Copy and download buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleCopy}
            className={`px-3.5 py-2 rounded-full text-xs font-bold cursor-pointer flex items-center space-x-1.5 transition-all outline-none ${
              copied
                ? "bg-emerald-600 text-white shadow shadow-emerald-100"
                : "bg-white hover:bg-stone-50 text-stone-700 border border-stone-200"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>複製成功！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>一鍵複製</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-full text-xs font-bold cursor-pointer flex items-center space-x-1.5 transition-all bg-[#5A5A40] hover:bg-[#4a4a34] text-white border border-[#5A5A40]"
          >
            <Download className="w-4 h-4" />
            <span>下載為 Markdown</span>
          </button>
        </div>
      </div>

      {/* Render Markdown result content */}
      <div className="prose prose-stone max-w-none text-stone-800">
        <Markdown components={renderers}>{resultText}</Markdown>
      </div>

      {/* Warning on missing action plans or standard details */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start space-x-3 mt-6">
        <FileText className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
        <div className="text-xs text-stone-605 leading-relaxed">
          <span className="font-bold">會議專員溫馨提示：</span>
          為保持優秀的非同步協作追蹤，建議將上述 Action Items (待辦事項) 貼至您的 Jira、Notion、Trello 或 Google Slides 中管理。您也可以在左側的「額外自訂要求」內即時微調。
        </div>
      </div>
    </div>
  );
}
