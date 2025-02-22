
import fetch from 'node-fetch';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊*`, m, );
    }

    let youtubeLink = args[0];
    
    // Verificación del enlace de YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(youtubeLink)) {
        return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] Asegúrese de que sea un enlace de YouTube.*`, m, );
    }


    try {
    await m.react('🕛'); // Indicar que está procesando

    // Primera API
    let apiResponse = await fetch(`https://api.agungny.my.id/api/youtube-video?url=${encodeURIComponent(youtubeLink)}`);
    let data = await apiResponse.json();

    if (data.status && data.result && data.result.downloadUrl) {
        const videoTitle = data.result.title;
        const videoUrl = data.result.downloadUrl;

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            fileName: `${videoTitle}.mp4`,
            mimetype: 'video/mp4',
            caption: `😎 Su video by *_KanBot_*:\n\n*🎬 Título:* ${videoTitle}`,
        }, { quoted: m });

        return await m.react('✅'); // Confirmar éxito
    }

    throw new Error("Primera API falló, intentando con la segunda...");
} catch (error) {
    console.warn("Error en la primera API:", error.message);

    try {
        await m.react('🕛'); // Indicar que está procesando la segunda API

        // Segunda API (Respaldo)
        let apiResponse2 = await fetch(`https://apidl.asepharyana.cloud/api/downloader/ytmp4?url=${encodeURIComponent(youtubeLink)}&quality=360`);
        let data2 = await apiResponse2.json();

        if (data2.url && data2.filename) {
            const videoTitle = data2.filename;
            const videoUrl = data2.url;

            await conn.sendMessage(m.chat, {
                video: { url: videoUrl },
                fileName: videoTitle,
                mimetype: 'video/mp4',
                caption: `😎 Su video by *_KanBot_*:\n\n*🎬 Título:* ${videoTitle}`,
            }, { quoted: m });

            return await m.react('✅'); // Confirmar éxito
        }

        throw new Error("Segunda API también falló.");
    } catch (backupError) {
        console.error("Error en la segunda API:", backupError.message);
        await m.react('❌');
        await conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] No se pudo obtener el video intente con /yt4doc*`, m);
    }
}
};

handler.tags = ['descargas'];
handler.help = ['ytv', 'ytmp4']
handler.command = ['ytmp4', 'ytvideo', 'ytv'];
handler.group = true;

export default handler;
