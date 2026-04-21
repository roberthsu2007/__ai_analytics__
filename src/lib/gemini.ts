import { GoogleGenAI } from "@google/genai";

// 初始化 Google GenAI
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY as string 
});

const SYSTEM_INSTRUCTIONS = `你是一位專業的資料分析師。
你的任務是接收一段 CSV 或表格結構的原始數據，理解其欄位意義，並提出精確的摘要報告與洞察。

請務必嚴格遵循以下 Markdown 輸出格式：

### 1. 📊 資料概況與欄位理解
簡要說明這份資料的主題是什麼，並列出關鍵欄位的意義。

### 2. ⚠️ 異常與缺值檢查
檢查資料中是否有空白（例如缺少數量或金額）、極端值（例如不合理的高價），並將發現的異常項目條列出來。若無異常，說明「未發現明顯異常」。

### 3. 📈 統計與趨勢洞察
請回答以下問題的總結：
- **總計概況**：銷售數量或總金額的大概加總。
- **分類表現**：哪個業務員或哪項產品表現最好？
- **業務建議**：從數據中給出 1-2 個可以執行的商業建議。`;

export async function analyzeData(csvContent: string) {
  try {
    const response = await ai.models.generateContent({
      // 根據使用者要求使用最新 Pro 模型
      // 由於環境目前建議使用 3.1 系列，這裡使用 gemini-3.1-pro-preview
      model: "gemini-3.1-pro-preview",
      contents: csvContent,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.1, // 降低隨機性，增加數據分析的準確性
      },
    });

    if (!response.text) {
      throw new Error("模型未返回任何結果");
    }

    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}
