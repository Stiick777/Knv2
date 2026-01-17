/*import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, command, args, text }) => {

if (command === 'play8' || command === 'playdoc2') {

    if (!text) 
      return conn.reply(
        m.chat,
        `🧿 *Ingrese un nombre de una canción de YouTube*\n\nEjemplo: !${command} falling - Daniel Trevor`,
        m
      );

    await m.react('🕛');

    const yt_play = await search(args.join(' '));

    if (yt_play[0].duration.seconds > 7200) {
        await conn.reply(m.chat, '❌ El video dura más de 2 horas y no puede ser descargado.', m);
        return await m.react('❌');
    }

    const texto1 = `
┏◚◚◚◚🅓🅞🅒🅢◚◚◚◚┓

🍁 *Titulo:*  
${yt_play[0].title}

🎀 *Publicado:*  
${yt_play[0].ago}

⏰ *Duración:*  
${secondString(yt_play[0].duration.seconds)}

🖋️ *Autor:*  
${yt_play[0].author.name}

🧿 *URL:*  
${yt_play[0].url}

📌 *Canal:*  
${yt_play[0].author.url}

┗◛◛◛🅚🅐🅝🅑🅞🅣◛◛◛┛

*Enviando su video, por favor espere...*
`.trim();

    await conn.sendMessage(m.chat, { text: texto1 }, { quoted: m });
try {
    await m.react('🕓');

    const url = yt_play[0].url;
    let title, downloadUrl, thumbnail;

    // ===================================================
    // ⭐ API PRINCIPAL: XYRO
    // ===================================================
    try {
        const response = await axios.post(
            "https://api.xyro.site/download/youtube",
            new URLSearchParams({ url }).toString(),
            {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/x-www-form-urlencoded"
                }
            }
        );

        const json = response.data;

        if (!json.success || !json.medias?.length) {
            throw new Error("XYRO inválido");
        }

        const media = json.medias[0]; // 👈 primer resultado

        title = json.title || "Video de YouTube";
        downloadUrl = media.url;
        thumbnail = json.thumbnail;

    } catch (e1) {

        // ===================================================
        // ⭐ RESPALDO: VREDEN
        // ===================================================
        try {
            const api2 = await fetch(
                `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(url)}&quality=360`
            );

            const json2 = await api2.json();

            if (!json2.status || !json2.result?.download?.url) {
                throw new Error("VREDEN inválido");
            }

            title = json2.result.metadata.title;
            downloadUrl = json2.result.download.url;
            thumbnail = json2.result.metadata.thumbnail;

        } catch (e2) {
            await conn.sendMessage(
                m.chat,
                { text: "❌ No se pudo descargar el video. Todas las APIs fallaron." },
                { quoted: m }
            );
            return await m.react('❌');
        }
    }

    // ===================================================
    // 📤 ENVIAR VIDEO FINAL
    // ===================================================
    await conn.sendMessage(
        m.chat,
        {
            document: { url: downloadUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n\n🌚 *_Provided by KanBot_* 🌝`,
            jpegThumbnail: thumbnail
                ? await (await fetch(thumbnail)).buffer()
                : null
        },
        { quoted: m }
    );

    await m.react('✅');

} catch (e) {
    await m.react('❌');
    conn.reply(m.chat, "❌ Error al procesar la descarga.", m);
}
}      
};

// === Metadatos ===
handler.help = ['play8'];
handler.tags = ['descargas'];
handler.command = ['playdoc2', 'play8'];
handler.group = true;
export default handler;

// === Funciones Auxiliares ===
async function search(query) {
    const s = await yts.search({ query, hl: 'es', gl: 'ES' });
    return s.videos;
}

function secondString(seconds) {
    seconds = Number(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}
*/
