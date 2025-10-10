import { GoogleGenAI } from "@google/genai";
import type { Chat, GenerateContentResponse, Content } from '@google/genai';

let ai: GoogleGenAI | null = null;

/**
 * Initializes the Gemini AI service.
 * This must be called before any other service function.
 * It expects the API key to be available in the environment.
 */
const initialize = () => {
    if (ai) {
        return;
    }
    try {
        // As per instructions, assuming process.env.API_KEY is available in the execution context.
        // This will throw an error if 'process' or 'process.env.API_KEY' is not defined,
        // which is handled by the try/catch block in App.tsx.
        // @ts-ignore - Assuming process is available in the environment
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (error) {
        console.error("Error initializing GoogleGenAI:", error);
        // Re-throw to be caught by the caller in App.tsx
        throw new Error("Failed to initialize Gemini Service. Ensure API_KEY is configured.");
    }
};

/**
 * Returns the initialized GoogleGenAI instance.
 * @returns The GoogleGenAI instance or null if not initialized.
 */
const getAiInstance = (): GoogleGenAI | null => {
    return ai;
};

/**
 * Creates a new chat session with the AI.
 * @param systemInstruction The system-level instructions for the chat model.
 * @param history The previous chat history to load into the session.
 * @returns A Chat instance.
 */
const createChat = (systemInstruction: string, history?: Content[]): Chat => {
    if (!ai) {
        throw new Error("Gemini service not initialized. Call initialize() first.");
    }
    const chatParams = {
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: systemInstruction,
        },
    };
    return ai.chats.create(chatParams);
};

/**
 * A simple retry wrapper with exponential backoff.
 * @param fn The async function to retry.
 * @param retries Number of retries.
 * @param delayMs Initial delay in milliseconds.
 * @returns The result of the provided function.
 */
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> => {
    let lastError: Error | undefined;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
            }
        }
    }
    throw lastError;
};

/**
 * Generates a single text response from a prompt.
 * @param prompt The text prompt to send to the model.
 * @returns The generation response.
 */
const generateText = async (prompt: string): Promise<GenerateContentResponse> => {
    if (!ai) {
        throw new Error("Gemini service not initialized. Call initialize() first.");
    }
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return result;
};


export const geminiService = {
  initialize,
  withRetry,
  createChat,
  generateText,
  getAiInstance,
};