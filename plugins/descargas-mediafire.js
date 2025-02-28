import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw m.reply(`Ingresa un link de MediaFire\n*✅ Ejemplo:* ${usedPrefix}${command} https://www.mediafire.com/file/zztjks8ei74nqhy/free+fire+v7a+atualizado+ENERO+2025.xapk/file`);

    conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    try {
        let response = await fetch(`https://dark-core-api.vercel.app/api/download/mediafire?key=api&url=${encodeURIComponent(text)}`);
        let data = await response.json();

        if (!data.url) throw m.reply("❌ No se pudo obtener el enlace de descarga.");

        await conn.sendFile(m.chat, data.url, data.filename || "archivo", 
            `*🌙 Nombre:* ${data.title}\n*☘️ Tamaño:* ${data.size}`, m
        );

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        m.reply("❌ Ocurrió un error al descargar el archivo.");
    }
};

handler.help = ['mediafire'];
handler.tags = ['descargas'];
handler.command = /^(mediafire|mf)$/i;
handler.group = true;

export default handler;