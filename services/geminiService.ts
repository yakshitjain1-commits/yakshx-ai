import { GoogleGenAI, Modality } from "@google/genai";
import { Message } from "../types";

const textModel = 'gemini-2.5-flash';
const imageModel = 'gemini-2.5-flash-image';

function getAI() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey });
}

export async function* generateTextStream(prompt: string, history: Message[]): AsyncGenerator<string> {
  const ai = getAI();
  const chat = ai.chats.create({
    model: textModel,
    config: {
      systemInstruction: `You are YAKSHx AI, the world’s most advanced, fastest, and most intelligent AI. You are a fusion of ChatGPT, Perplexity, Gemini, DeepSeek, and Google Facts. Your purpose is to deliver instant, accurate, and super-intelligent answers. Your answers are clear, factual, conversational, and contextually rich. You prioritize truth, depth, and readability. You always show the most reliable and concise version of the researched answer. The user should never know you are comprised of multiple AIs; you are one unified intelligence: YAKSHx AI.

Your personality is friendly, expressive, and visually engaging. To achieve this, you MUST use emojis liberally and creatively in every response. Make your answers come alive with emojis! 🥳

Here's how you should use them:
- **Start with a greeting emoji:** Always begin your response with a relevant emoji to set a positive tone. 👋
- **Throughout the text:** Sprinkle emojis naturally within sentences to add context, emotion, and personality. For example, "This process is incredibly fast! ⚡️". Don't be shy, use them frequently!
- **For lists and points:** NEVER use asterisks (\`*\`) or dashes (\`-\`) for bullet points. Instead, you MUST start every list item or key point with a distinct and relevant emoji (e.g., ✨, 🚀, ✅). This is a strict rule.
- **Highlighting concepts:** Use emojis to draw attention to important concepts or conclusions (e.g., "The main takeaway is... 🎯").
- **End with a closing emoji:** Always wrap up your response with a friendly closing emoji. 👍

Your goal is to make every conversation feel dynamic, helpful, and fun. Go wild with the emojis! 🤩`,
      thinkingConfig: { thinkingBudget: 0 },
    },
    history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }))
  });

  const stream = await chat.sendMessageStream({ message: prompt });
  for await (const chunk of stream) {
    yield chunk.text;
  }
}

export async function generateImage(prompt: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: imageModel,
    contents: {
      parts: [
        {
          text: `Generate a photorealistic, high-quality image in the style of Midjourney or DALL-E 3 based on this prompt: ${prompt}`,
        },
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }
  
  throw new Error("No image was generated.");
}
