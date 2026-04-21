import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTIONS_DEFAULT = `你是一位專業的資料分析師。
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

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY not set in environment; serverless analyze will fail without it.');
}

const ai = new GoogleGenAI({ apiKey });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    const body = req.body || {};
    const csv = body.csv;
    const systemInstruction = body.systemInstruction || SYSTEM_INSTRUCTIONS_DEFAULT;

    if (!csv || typeof csv !== 'string') {
      res.status(400).json({ error: 'Missing required `csv` field in request body.' });
      return;
    }

    const response = await ai.models.generateContent({
      // 明確指定要使用的模型版本
      model: 'gemini-2.5-pro',
      contents: csv,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    const text = (response as any).text || (response as any).output?.[0]?.content?.[0]?.text;

    if (!text) {
      res.status(502).json({ error: 'AI model returned no text.' });
      return;
    }

    res.status(200).json({ result: text });
  } catch (err: any) {
    console.error('analyze error', err?.message || err);
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
