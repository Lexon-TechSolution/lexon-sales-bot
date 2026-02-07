import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// 1. WEB SERVER KWA AJILI YA RENDER (Port Binding)
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('Lexon AI Sales Bot is Alive and Running!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Web Server inasikiliza kwenye port ${PORT}`);
});

// 2. KUKAGUA CONFIGURATION
if (!process.env.GEMINI_API_KEY || !process.env.SHEET_URL) {
    console.log("⚠️ ONYO: Hakikisha GEMINI_API_KEY na SHEET_URL zimewekwa kwenye Render Environment Variables!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 3. ANZA CLIENT (PUPPETEER CONFIG)
// Tumeondoa executablePath ili iruhusu image ya Docker ichague Chrome yenyewe
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process'
        ],
    }
});

// 4. QR CODE & STATUS
client.on('qr', (qr) => {
    console.log('---------------------------------------------------------');
    console.log('✅ SCAN QR CODE HAPA CHINI:');
    qrcode.generate(qr, { small: true });
    console.log('---------------------------------------------------------');
});

client.on('ready', () => {
    console.log('🚀 LEXON AI SALES BOT IKO TAYARI KAZINI!');
});

// 5. KUSHUGHULIKIA UJUMBE
client.on('message', async (msg) => {
    // Puuza meseji za kwenye magrupu
    if (msg.from.includes('@g.us')) return;

    try {
        // Pata data kutoka Google Sheet
        const res = await axios.get(process.env.SHEET_URL);
        const businessData = JSON.stringify(res.data);

        const prompt = `
            Wewe ni Lexon AI, msaidizi mwerevu wa mauzo. 
            Tumia maelezo haya ya biashara kujibu maswali: ${businessData}
            Mteja anasema: "${msg.body}"
            Jibu kwa Kiswahili fasaha, kifupi na rafiki. 
            Kama jibu halipo kwenye data, muombe asubiri mtaalam awasiliane naye hivi punde.
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        await client.sendMessage(msg.from, aiResponse);
        console.log(`✅ Jibu limetumwa kwa: ${msg.from}`);

    } catch (error) {
        console.error("❌ ERROR:", error.message);
    }
});

// WASHA BOT
console.log('🎬 Inawasha Bot... Tafadhali subiri...');
client.initialize();
