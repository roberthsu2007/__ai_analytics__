import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" })); // Increase limit for long transcripts

const PORT = 3000;

// Lazy initialize Google GenAI so node doesn't crash on boot if key is missing
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("無法偵測到 GEMINI_API_KEY。請前往 AI Studio 右上角「Settings > Secrets」設定您的金鑰！");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System Instruction to govern the AI output style
const SYSTEM_INSTRUCTIONS = `你是一位專業的會議記錄助理。請根據使用者提供的會議逐字稿，整理出結構化的會議紀錄。
請務必遵守以下輸出格式要求：

1. **會議主題與時間**：擷取會議的主題與時間。
2. **與會者**：列出參與會議的人員。
3. **會議重點總結**：用 3 到 5 個重點總結會議內容。
4. **Action Items (待辦事項)**：明確列出接下來的待辦事項與負責人。
5. **英文翻譯版**：將上述 1~4 點的內容完整翻譯成專業的英文。

請以 Markdown 格式輸出，所有繁體中文部分必須使用**繁體中文**回覆，不要包含任何額外的問候語或結語。`;

// Endpoint: Analyze traditional transcripts
app.post("/api/meetings/analyze", async (req, res) => {
  try {
    const { transcript, language, style, focus, customInstruction } = req.body;

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      res.status(400).json({ error: "請提供會議逐字稿或筆記內容。" });
      return;
    }

    const ai = getGenAI();

    // Dynamically construct a highly contextual prompt to feed into Gemini
    let focusText = "";
    if (focus && Array.isArray(focus) && focus.length > 0) {
      focusText = `【重點分析區塊】請特別著重提取並生成以下區塊：${focus.join("、")}`;
    } else {
      focusText = "【重點分析區塊】請包含：簡要摘要、決議事項、Action Items (待辦事項清單)、重要討論細節。";
    }

    const targetLanguage = language || "繁體中文";
    const targetStyle = style || "專業商務";

    const prompt = `
請分析以下會議內容，並根據設定輸出對應的會議紀錄：

---
【會議逐字稿/筆記長度】：${transcript.length}字
【目標輸出語言 / 翻譯】：${targetLanguage}
【希望風格等級】：${targetStyle}
${focusText}
${customInstruction ? `【額外自訂要求】：${customInstruction}` : ""}
---

以下是會議內容正文：
"""
${transcript}
"""

請立即根據 System Instructions 提供高品質的 Markdown 格式會議報告與翻譯結果：
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.2, // Low temperature for more reliable extraction
      },
    });

    const resultText = response.text || "（AI 未回傳任何文字結果）";

    res.json({
      success: true,
      resultText,
      modelUsed: "gemini-3.5-flash",
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Gemini API processing failed:", error);
    res.status(500).json({
      error: error.message || "伺服器在與 Gemini 進行通訊時發生了意外錯誤。",
    });
  }
});

// Configure Vite middleware in development or static dist hosting in production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server mounted on backend.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static build routing mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fullstack meeting summarizer running at http://localhost:${PORT}`);
  });
}

start();
