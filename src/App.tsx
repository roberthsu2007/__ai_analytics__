import React, { useState } from 'react';
import { 
  BarChart2, 
  Play, 
  Copy, 
  Check, 
  Loader2, 
  FileSpreadsheet, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeData } from './lib/gemini.js';

export default function App() {
  const [csvInput, setCsvInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!csvInput.trim()) {
      setError('請輸入 CSV 數據。');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult('');
    
    try {
      const result = await analyzeData(csvInput);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || '分析過程中發生錯誤，請稍後再試。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysisResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setCsvInput('');
    setAnalysisResult('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">AI</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">AI 數據分析與洞察工具</h1>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-indigo-700">Gemini Pro 已就緒</span>
          </div>
          <div className="text-sm text-slate-400 font-mono">v1.2.0</div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-w-[1440px] mx-auto w-full">
        {/* Input Card - Left Bento Box */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col p-5 h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                輸入原始 CSV 資料
              </label>
              <button 
                onClick={handleReset}
                className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                重設
              </button>
            </div>
            
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="請在此貼上您的 CSV 資料...\n例如：\n日期,產品,銷量,金額\n2024-01-01,蘋果,10,100"
              className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all leading-relaxed"
            />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !csvInput.trim()}
              className={`mt-4 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                isAnalyzing || !csvInput.trim() 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI 分析計算中...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>開始 AI 分析</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message Mini-Bento */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm shadow-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Card - Right Bento Box */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[600px]">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
              <h2 className="font-bold text-slate-800 tracking-tight">AI 分析報告與洞察</h2>
            </div>
            
            {analysisResult && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-all shadow-sm"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">已複製</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>一鍵複製內容</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {analysisResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-slate prose-indigo max-w-none 
                             prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                             prose-h3:text-lg prose-h3:mt-0 prose-h3:mb-4 prose-h3:flex prose-h3:items-center prose-h3:gap-2
                             prose-p:text-slate-600 prose-p:leading-relaxed
                             prose-ul:list-disc prose-ul:pl-4 
                             prose-li:text-slate-600 prose-li:my-2
                             prose-strong:text-slate-900"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {analysisResult}
                  </ReactMarkdown>
                </motion.div>
              ) : isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
                   <div className="relative">
                      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                   </div>
                   <p className="text-sm font-medium animate-pulse">正在深度分析數據結構...</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 select-none grayscale opacity-60">
                  <BarChart2 className="w-16 h-16" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-400">尚未有分析資料</p>
                    <p className="text-sm">請於左側輸入 CSV 數據後點擊開始分析</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="px-8 py-8 border-t border-slate-200 text-center space-y-3 bg-white mt-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">由 Google Gemini 提供 AI 辨識與建議</p>
        <p className="text-[10px] text-slate-400 max-w-lg mx-auto leading-relaxed">
          本平台僅供初步數據趨勢參考。人工智慧產出結果可能存在侷限性，請於專業決策前再次人工核實原始數據。
        </p>
      </footer>
    </div>
  );
}
