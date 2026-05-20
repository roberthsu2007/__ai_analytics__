export interface MeetingAnalyzeRequest {
  transcript: string;
  language: string;
  style: string;
  focus: string[];
  customInstruction?: string;
}

export interface MeetingAnalyzeResponse {
  success: boolean;
  resultText: string;
  modelUsed: string;
  generatedAt: string;
  error?: string;
}

export interface MeetingTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  transcript: string;
}
