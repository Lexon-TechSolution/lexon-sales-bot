
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getSalesResponse = async (
  userInput: string,
  inventory: Product[],
  history: { role: 'user' | 'model'; text: string }[]
) => {
  const inventoryContext = inventory
    .map(p => `Bidhaa: ${p.bidhaa}, Bei: ${p.bei}, Maelezo: ${p.maelezo}, Stock: ${p.stock}`)
    .join("\n");

  const systemInstruction = `
    Wewe ni msaidizi wa mauzo wa duka la "Lexon Store". 
    Lugha yako kuu ni Kiswahili cha kibiashara na rafiki.
    
    MAAGIZO YA KAZI:
    1. Greeting: Mteja akisalimia, mjibu: "Habari! Karibu Lexon Store. Mimi ni msaidizi wa AI. Unatafuta bidhaa gani leo?"
    2. Inquiry: Tumia data ya bidhaa hapa chini kujibu maswali ya mteja.
    3. Product Not Found: Kama mteja anaulizia bidhaa ambayo haipo kwenye orodha, sema: "Samahani bidhaa hiyo haipo kwa sasa, tafadhali subiri mhudumu atakujibu."
    4. Ordering: Kama mteja akionyesha nia ya kununua au kutoa oda, omba namba yake ya simu na location yake kwa ajili ya kufanya oda.
    
    DATA YA BIDHAA (INVENTORY):
    ${inventoryContext}
    
    Jibu kwa ufupi, kwa weledi, na kwa lugha ya Kiswahili pekee.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Samahani, kuna tatizo la kiufundi. Jaribu tena.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Samahani, siwezi kujibu kwa sasa kutokana na matatizo ya mtandao.";
  }
};
