import { MeetingTemplate } from "../types";
import { MEETING_TEMPLATES } from "../data/templates";
import { BookOpen, ChevronRight, MessageSquareCode } from "lucide-react";

interface TemplateSelectorProps {
  onSelect: (transcript: string) => void;
  activeTemplateId: string | null;
}

export default function TemplateSelector({ onSelect, activeTemplateId }: TemplateSelectorProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 mb-6">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-1.5 bg-stone-100 text-[#5A5A40] rounded-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-md font-bold text-stone-900">體驗會議範本</h3>
          <p className="text-xs text-stone-500 font-medium">還沒有自己的錄音逐字稿？一鍵匯入以下真實對話，立刻體驗 AI 智慧重組魅力</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MEETING_TEMPLATES.map((tpl) => {
          const isActive = activeTemplateId === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.transcript)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isActive
                  ? "border-[#5A5A40] bg-[#F5F5F0]/60 ring-2 ring-[#5A5A40]/10 shadow-sm"
                  : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 hover:shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                    {tpl.category}
                  </span>
                  <MessageSquareCode className={`w-4 h-4 transition-colors ${isActive ? "text-[#5A5A40]" : "text-stone-300 group-hover:text-stone-400"}`} />
                </div>
                <h4 className="text-sm font-bold text-stone-850 mb-1 group-hover:text-[#5A5A40] transition-colors">
                  {tpl.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className={`flex items-center text-xs font-bold mt-3 group-hover:translate-x-0.5 transition-transform ${isActive ? "text-[#5A5A40]" : "text-stone-605 group-hover:text-[#5A5A40]"}`}>
                <span>一鍵載入逐字稿</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
