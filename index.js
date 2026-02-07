import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express'; // Tumeongeza hii

dotenv.config();

// 1. ANZA WEB SERVER KWA AJILI YA RENDER
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('Lexon AI Sales Bot is Alive and Running!');
});

app.listen(PORT, () => {
    console.log(`✅ Web Server inasikiliza kwenye port ${PORT}`);
});

// 2. KUKAGUA CONFIGURATION
if (!process.env.GEMINI_API_KEY || !process.env.SHEET_URL) {
    console.log("⚠️ ONYO: Hakikisha GEMINI_API_KEY na SHEET_URL zimewekwa kwenye Render Environment Variables!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 3. KUANDAA WHATSAPP CLIENT
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

// Onyesha QR Code kwenye Logs za Render
client.on('qr', (qr) => {
    console.log('---------------------------------------------------------');
    console.log('✅ SCAN QR CODE HAPA CHINI NA WHATSAPP YAKO:');
    qrcode.generate(qr, { small: true });
    console.log('---------------------------------------------------------');
});

client.on('ready', () => {
    console.log('🚀 LEXON AI SALES BOT IKO TAYARI!');
});

// 4. KUSHUGHULIKIA UJUMBE
client.on('message', async (msg) => {
    if (msg.from.includes('@g.us')) return;

    console.log(`📩 Ujumbe: ${msg.body}`);

    try {
        // Chukuwa data kutoka Google Sheet
        const res = await axios.get(process.env.SHEET_URL);
        const businessData = JSON.stringify(res.data);

        const prompt = `
            Wewe ni Lexon AI, msaidizi mwerevu wa mauzo. 
            Tumia maelezo haya ya biashara kujibu maswali: ${businessData}
            Mteja anasema: "${msg.body}"
            Jibu kwa lugha ya Kiswahili fasaha, rafiki na ya kibiashara. 
            Kama hujui jibu, muombe mteja asubiri kidogo mtaalam wa binadamu awasiliane naye.
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        await client.sendMessage(msg.from, aiResponse);
        console.log('✅ Jibu limetumwa!');

    } catch (error) {
        console.error("❌ ERROR:", error.message);
    }
});

// WASHA BOT
console.log('🎬 Inawasha Bot...');
client.initialize();
