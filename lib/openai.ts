import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SkillAnalysisResult {
  score: number;
  level: "Fresher" | "Mid-Level" | "Senior";
  subScores: {
    github: number;
    leetcode: number;
    resume: number;
  };
  strengths: string[];
  weaknesses: string[];
  insights: string;
  confidenceLevel: "Low" | "Medium" | "High";
}

/**
 * Generates a comprehensive skill analysis based on multi-source developer data.
 * Implements the core "Hackify AI Model Prompt" using Google Gemini.
 */
export async function generateSkillAnalysis(data: {
  github?: any;
  leetcode?: any;
  linkedin?: any;
}): Promise<SkillAnalysisResult> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const systemPrompt = `
You are an advanced AI system designed to evaluate a developer’s real-world skills based on their activity across GitHub, LeetCode, and LinkedIn (or Resume).
Your goal is to analyze data and generate a reliable, explainable hiring score using specific weights from recent research.

### Scoring Methodology:
First, determine the candidate's Experience Level:
1. **Fresher**: Entry-level or students (0 years experience).
2. **Mid-Level**: 1-3 years of professional experience.
3. **Senior**: 4+ years of professional experience.

Once the level is determined, assign a score (0-100) to each category:
- **GitHub**: Project complexity, contribution history, and code quality.
- **LeetCode**: Problem-solving prowess and consistency.
- **Resume/LinkedIn**: Professional experience, roles, and certifications.

Calculate the final weighted score (Wx, Wy, Wz) based on the level:
- **Fresher**: GitHub (35%) + Resume (10%) + LeetCode (55%)
- **Mid-Level**: GitHub (30%) + Resume (40%) + LeetCode (30%)
- **Senior**: GitHub (20%) + Resume (60%) + LeetCode (20%)

### Rules:
- Be honest and critical.
- Do NOT assume missing data.
- If data is insufficient, reduce confidence level.

Return ONLY a JSON object in this format:
{
  "score": number, 
  "level": "Fresher" | "Mid-Level" | "Senior",
  "subScores": {
    "github": number,
    "leetcode": number,
    "resume": number
  },
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "insights": "...",
  "confidenceLevel": "Low" | "Medium" | "High"
}
  `;

  const userContent = `Developer Data Context:
GitHub: ${JSON.stringify(data.github || "No data")}
LeetCode: ${JSON.stringify(data.leetcode || "No data")}
LinkedIn: ${JSON.stringify(data.linkedin || "No data")}
  `;

  const prompt = `${systemPrompt}\n\n${userContent}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) {
    throw new Error("Gemini response missing content");
  }

  try {
    return JSON.parse(content) as SkillAnalysisResult;
  } catch (e) {
    // Fallback for cases where JSON might be wrapped in code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as SkillAnalysisResult;
    }
    throw new Error(`Failed to parse Gemini response as JSON: ${content}`);
  }
}
/**
 * Evaluates a single code submission against a specific task.
 */
export async function evaluateCodeSubmission(data: {
  taskTitle: string;
  taskDescription: string;
  code: string;
}) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
You are an expert coding interviewer. Evaluate the following code submission for the task: "${data.taskTitle}".

Task Description:
${data.taskDescription}

Submitted Code:
\`\`\`
${data.code}
\`\`\`

Evaluate based on:
1. Correctness (does it solve the problem?).
2. Efficiency.
3. Code quality and best practices.

Return a JSON object in this format:
{
  "score": number (0-100),
  "feedback": "...",
  "breakdown": {
    "correctness": number (0-100),
    "performance": number (0-100),
    "style": number (0-100)
  }
}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) {
    throw new Error("Gemini response missing content");
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error(`Failed to parse evaluation response: ${content}`);
  }
}
