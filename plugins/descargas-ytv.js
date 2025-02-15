
import fetch from 'node-fetch';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊*`, m, rcanal);
    }

    let youtubeLink = args[0];
    
    // Verificación del enlace de YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(youtubeLink)) {
        return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] Asegúrese de que sea un enlace de YouTube.*`, m, rcanal);
    }


    try {
        await m.react('🕛')
    let apiResponse = await fetch(`https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(youtubeLink)}`);
    let data = await apiResponse.json();

    if (data.success) {
        const videoTitle = data.result.title;
        const videoUrl = data.result.download_url;
        const videoQuality = data.result.quality;

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            fileName: `${videoTitle}.mp4`,
            mimetype: 'video/mp4',
            caption: `😎 Su video by *_KanBot_*:\n\n*🎬 Título:* ${videoTitle}\n📌 *Calidad:* ${videoQuality}`,
        }, { quoted: m });
        await m.react('✅')
    } else {
        await m.react('❌')
        await conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] No se pudo obtener el video.*`, m);
    }
} catch (error) {
        await m.react('❌')
    console.error('Error en la API de David Cyril:', error);
    await conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] Ocurrió un error al intentar descargar el video, intente con otra opción {/yt4doc}.*`, m);
}
};

handler.tags = ['descargas'];
handler.help = ['ytv', 'ytmp4']
handler.command = ['ytmp4', 'ytvideo', 'ytv'];
handler.group = true;

export default handler;
