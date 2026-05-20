import React, { useState } from "react";
import { 
  Languages, 
  Settings, 
  Sliders, 
  Sparkles, 
  Trash2, 
  FileCheck, 
  FileText,
  Loader2
} from "lucide-react";

interface MeetingInputProps {
  transcript: string;
  setTranscript: (val: string) => void;
  onSubmit: (config: {
    language: string;
    style: string;
    focus: string[];
    customInstruction: string;
  }) => void;
  isLoading: boolean;
}

const LANGUAGES = [
  { code: "繁體中文", name: "繁體中文（預設）" },
  { code: "English", name: "English (英文)" },
  { code: "日本語", name: "日本語 (日文)" },
  { code: "한국어", name: "한국어 (韓文)" },
  { code: "Español", name: "Español (西班牙文)" },
  { code: "Français", name: "Français (法文)" },
  { code: "Deutsch", name: "Deutsch (德文)" }
];

const STYLES = [
  { id: "專業商務", name: "專業商務", desc: "客觀嚴謹，適合主管與高層匯報" },
  { id: "技術開發與架構", name: "軟體研發技術", desc: "強化 API、架構邏輯、代碼與技術重構" },
  { id: "市場行銷與創意", name: "行銷創意", desc: "注重行銷點子、KOL、社群傳播與活動" },
  { id: "極簡快訊", name: "極簡快訊", desc: "超省時！快速看過不囉唆" },
  { id: "非同步待辦列表", name: "待辦清單優先", desc: "專注在誰在什麼時候該做什麼事" }
];

const FOCUS_SECTORS = [
  { id: "簡要概觀與摘要", label: "核心會議簡要" },
  { id: "重要決議項目表元", label: "重要決議事項" },
  { id: "精煉待辦事項 (Action Items)", label: "Action Items (含負責人)" },
  { id: "細部討論過程大綱", label: "討論細節大綱" },
  { id: "代確認、有爭議與未決事項", label: "待確認及爭議點" }
];

export default function MeetingInput({ transcript, setTranscript, onSubmit, isLoading }: MeetingInputProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("繁體中文");
  const [selectedStyle, setSelectedStyle] = useState("專業商務");
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    "簡要概觀與摘要",
    "重要決議項目表元",
    "精煉待辦事項 (Action Items)"
  ]);
  const [customInstruction, setCustomInstruction] = useState("");

  const handleFocusToggle = (id: string) => {
    if (selectedFocus.includes(id)) {
      setSelectedFocus(selectedFocus.filter((f) => f !== id));
    } else {
      setSelectedFocus([...selectedFocus, id]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    onSubmit({
      language: selectedLanguage,
      style: selectedStyle,
      focus: selectedFocus,
      customInstruction
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Input Area */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-3">
          <label htmlFor="transcriptInput" className="text-sm font-bold text-stone-700 flex items-center space-x-2">
            <FileText className="w-4.5 h-4.5 text-[#5A5A40]" />
            <span>會議逐字稿 或 隨手筆記</span>
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-stone-400 font-mono">
              已輸入：{transcript.length} 字
            </span>
            {transcript && (
              <button
                type="button"
                onClick={() => setTranscript("")}
                className="text-xs text-stone-500 hover:text-red-650 transition-colors flex items-center space-x-1 cursor-pointer bg-stone-100 px-2 py-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清除</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          id="transcriptInput"
          placeholder="請在此處貼上您錄下的會議逐字稿、會議雜亂筆記、或語音轉文字的內容。您也可以在上方點擊會議範本直接進行匯入..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={12}
          className="w-full text-stone-700 bg-transparent resize-none focus:outline-none leading-relaxed placeholder:text-stone-300 min-h-[300px] border border-stone-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all text-sm font-sans"
        />
      </div>

      {/* Configuration Suite */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
          <Sliders className="w-4.5 h-4.5 text-[#5A5A40]" />
          <h3 className="text-sm font-bold text-stone-700">AI 智慧分析設定</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Language translation option */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-605 block flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[#5A5A40]" />
              輸出語言 / 翻譯語言
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full text-xs text-stone-705 border border-stone-200 rounded-xl py-2.5 px-3 bg-white focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all outline-none cursor-pointer font-medium"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Style select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-605 block flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-[#5A5A40]" />
              產出文件風格
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full text-xs text-stone-705 border border-stone-200 rounded-xl py-2.5 px-3 bg-white focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all outline-none cursor-pointer font-medium"
            >
              {STYLES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} — ({st.desc})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Focus sector selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-stone-605 block flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
            欲專注提取的會議區塊 (多選)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {FOCUS_SECTORS.map((sec) => {
              const isChecked = selectedFocus.includes(sec.id);
              return (
                <button
                  type="button"
                  key={sec.id}
                  onClick={() => handleFocusToggle(sec.id)}
                  className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isChecked
                      ? "border-[#5A5A40] bg-[#F5F5F0] text-stone-800 shadow-sm"
                      : "border-stone-200 bg-white hover:bg-stone-50 text-stone-500"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isChecked ? "bg-[#5A5A40]" : "bg-stone-300"}`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-stone-605 block">
            額外自訂指示 (非必填，例如：請以第三人稱撰寫、或繪製重要關鍵名詞對照等)
          </label>
          <input
            type="text"
            placeholder="例如：請強調後端延遲的爭執過程、或條列中英專有名詞對照對照表..."
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            className="w-full text-xs border border-stone-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all outline-none text-stone-700"
          />
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={isLoading || !transcript.trim()}
        className={`w-full py-4 px-6 rounded-full font-bold text-white shadow-md transition-all flex items-center justify-center space-x-2.5 cursor-pointer active:scale-98 ${
          isLoading 
            ? "bg-stone-400 shadow-none cursor-not-allowed" 
            : !transcript.trim()
            ? "bg-stone-300 text-stone-500 shadow-none cursor-not-allowed"
            : "bg-[#5A5A40] hover:bg-[#4a4a34] shadow-stone-200"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>AI 會議秘書正在精研您的逐字稿，這通常需要數秒鐘...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 animate-bounce" />
            <span>生成總結與翻譯</span>
          </>
        )}
      </button>
    </form>
  );
}
