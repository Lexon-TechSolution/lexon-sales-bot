import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SHEET_URL = "WEKA_LINK_YAKO_HAPA"; 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        // HAPA NDIPO MABADILIKO YALIPO:
        browser: 'firefox', 
        headless: true, // Iweke true ili isifungue window kubwa
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('✅ QR CODE TAYARI! SCAN SASA:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🚀 LEXON AI: Imewaka kwenye Firefox! Bot iko tayari.');
});

client.on('message', async (msg) => {
    if (msg.from.includes('@g.us')) return;
    try {
        const res = await axios.get(SHEET_URL);
        const data = res.data;
        const prompt = `Wewe ni Lexon AI Sales Assistant. Tumia data hizi: ${data}. Mteja amesema: ${msg.body}. Jibu kwa Kiswahili.`;
        
        const result = await model.generateContent(prompt);
        await client.sendMessage(msg.from, result.response.text());
        console.log('✅ Jibu limetumwa kwa: ' + msg.from);
    } catch (e) {
        console.log("Error:", e.message);
    }
});

client.initialize();
