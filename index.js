import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Angalia kama Key zipo (kwa ajili ya Logs)
if (!process.env.GEMINI_API_KEY || !process.env.SHEET_URL) {
    console.log("⚠️ ONYO: Hakikisha GEMINI_API_KEY na SHEET_URL zimewekwa kwenye Render Environment Variables!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Hii inatafuta Chrome popote ilipo (Render au Mac)
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

// Onyesha QR Code
client.on('qr', (qr) => {
    console.log('---------------------------------------------------------');
    console.log('✅ SCAN QR CODE HAPA CHINI NA WHATSAPP YAKO:');
    qrcode.generate(qr, { small: true });
    console.log('---------------------------------------------------------');
});

// Ikishaunganishwa
client.on('ready', () => {
    console.log('🚀 LEXON AI SALES BOT IKO TAYARI!');
    console.log('Inasubiri ujumbe sasa...');
});

// Kushughulikia ujumbe
client.on('message', async (msg) => {
    // Puuza meseji za group
    if (msg.from.includes('@g.us')) return;

    console.log(`📩 Ujumbe mpya kutoka kwa ${msg.from}: ${msg.body}`);

    try {
        // 1. Chukuwa data kutoka Google Sheet
        const res = await axios.get(process.env.SHEET_URL);
        const businessData = JSON.stringify(res.data);

        // 2. Tengeneza prompt kwa ajili ya Gemini
        const prompt = `
            Wewe ni Lexon AI, msaidizi mwerevu wa mauzo. 
            Tumia maelezo haya ya biashara kujibu maswali: ${businessData}
            Mteja anasema: "${msg.body}"
            Jibu kwa lugha ya Kiswahili fasaha, rafiki na ya kibiashara. 
            Kama hujui jibu, muombe mteja asubiri kidogo mtaalam wa binadamu awasiliane naye.
        `;

        // 3. Pata jibu kutoka kwa Gemini
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        // 4. Tuma jibu kwa mteja
        await client.sendMessage(msg.from, aiResponse);
        console.log('✅ Jibu limetumwa kwa mteja!');

    } catch (error) {
        console.error("❌ ERROR ILIYOTOKEA:", error.message);
    }
});

// Washa Bot
console.log('🎬 Inawasha Bot... Subiri kidogo...');
client.initialize();
