import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { csvContent } = req.body;

  if (!csvContent || typeof csvContent !== "string") {
    return res.status(400).json({ error: "Missing or invalid csvContent" });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        { role: "user", parts: [{ text: SYSTEM_INSTRUCTIONS + "\n\n請分析以下資料：\n" + csvContent }] }
      ],
    });

    if (!response.text) {
      throw new Error("模型未返回任何結果");
    }

    res.status(200).json({ result: response.text });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: error.message || "分析過程中發生錯誤" });
  }
}