import { performance } from 'perf_hooks';
import os from 'os';
import fetch from 'node-fetch';
import { execSync } from 'child_process';

let handler = async (m, { conn }) => {
    let uptimeBot = process.uptime();
    let uptimeSystem = os.uptime();

    // Latencia
    let start = performance.now();
    let end = performance.now();
    let speed = (end - start).toFixed(3);

    // Memoria
    let memUsed = process.memoryUsage();
    let totalMem = os.totalmem();
    let freeMem = os.freemem();

    // Info IP
    let ipData = await fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .catch(() => null);

    let country = ipData ? `${ipData.country_name} (${ipData.country_code})` : 'Desconocido';
    let timezone = ipData ? ipData.timezone : 'Desconocido';

    // Espacio en disco
    let diskInfo;
    try {
        let output = execSync('df -h /').toString();
        let lines = output.trim().split('\n');
        let data = lines[1].split(/\s+/); // segunda línea
        diskInfo = {
            size: data[1],
            used: data[2],
            available: data[3],
            usage: data[4]
        };
    } catch (e) {
        diskInfo = { size: 'Error', used: 'Error', available: 'Error', usage: 'Error' };
    }

    let status = `「 *ꜱᴛᴀᴛᴜꜱ ꜱᴇʀᴠᴇʀ* 」\n\n` +
        `✦ *ᴜʙɪᴄᴀᴄɪóɴ*: ${country}\n` +
        `✦ *ᴢᴏɴᴀ ʜᴏʀᴀʀɪᴀ*: ${timezone}\n\n` +
        `✯ *ᴜᴘᴛɪᴍᴇ ʙᴏᴛ*: ${formatTime(uptimeBot)}\n` +
        `✯️ *ᴜᴘᴛɪᴍᴇ ꜱɪꜱᴛᴇᴍ*: ${formatTime(uptimeSystem)}\n` +
        `✯ *ʟᴀᴛᴇɴᴄɪᴀ*: ${speed} ms\n\n` +
        `➛ *ʀᴀᴍ ᴜꜱᴀᴅᴀ*: ${(memUsed.rss / 1024 / 1024).toFixed(2)} MB\n` +
        `➛ *ʀᴀᴍ ᴛᴏᴛᴀʟ*: ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
        `➛ *ʀᴀᴍ ʟɪʙʀᴇ*: ${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB\n\n` +
        `➛ *ᴅɪꜱᴄᴏ ᴛᴏᴛᴀʟ*: ${diskInfo.size}\n` +
        `➛ *ᴅɪꜱᴄᴏ ᴜꜱᴀᴅᴏ*: ${diskInfo.used}\n` +
        `➛ *ᴅɪꜱᴄᴏ ʟɪʙʀᴇ*: ${diskInfo.available}\n` +
        `➛ *ᴜꜱᴏ ᴅᴇ ᴅɪꜱᴄᴏ*: ${diskInfo.usage}\n\n` +
        `*« ᴘʀᴏᴠɪᴅᴇᴅ ʙʏ ꜱᴛɪɪᴠᴇɴ »*`;

    await conn.sendMessage(m.chat, { text: status }, { quoted: m });
};

handler.help = ['status'];
handler.tags = ['main'];
handler.command = ['estado', 'status', 'server'];

export default handler;

function formatTime(seconds) {
    let d = Math.floor(seconds / 86400);
    let h = Math.floor((seconds % 86400) / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}
