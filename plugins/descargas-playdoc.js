import fetch from 'node-fetch'
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

        // === API 1: Ruby-Core ===
        try {
            const api1 = await fetch(`https://ruby-core.vercel.app/api/download/youtube/mp4?url=${encodeURIComponent(url)}`);
            const res1 = await api1.json();

            if (!res1.status || !res1.download?.url) throw new Error();

            title = res1.metadata.title;
            downloadUrl = res1.download.url;
            thumbnail = res1.metadata.thumbnail;

        } catch (e1) {

            // === API 2: Starlight ===
            try {
                const api2 = await fetch(`https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(url)}`);
                const res2 = await api2.json();

                if (!res2.url) throw new Error();

                title = res2.title;
                downloadUrl = res2.url;
                thumbnail = res2.thumbnail;

            } catch (e2) {

                // === API 3: Yupra ===
                try {
                    const api3 = await fetch(`https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`);
                    const res3 = await api3.json();

                    if (!res3.status || !res3.result?.formats?.length) throw new Error();

                    const video = res3.result.formats.find(f => f.itag === 18) || res3.result.formats[0];

                    title = res3.result.title;
                    downloadUrl = video.url;
                    thumbnail = res3.result.thumbnail;

                } catch (e3) {

                    // === API 4: Shylpy ===
                    try {
                        const api4 = await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=sylphy-25c2`);
                        const res4 = await api4.json();

                        if (!res4.res?.url) throw new Error();

                        title = res4.res.title;
                        downloadUrl = res4.res.url;
                        thumbnail = null;

                    } catch (e4) {

                        // === API 5: Stellar ===
                        try {
                            const api5 = await fetch(`https://api.stellarwa.xyz/dow/ytmp4v2?url=${encodeURIComponent(url)}&apikey=stellar-53mIXDr2`);
                            const res5 = await api5.json();

                            if (!res5.data?.dl) throw new Error();

                            title = res5.data.title;
                            downloadUrl = res5.data.dl;
                            thumbnail = res5.data.thumbnail;

                        } catch (e5) {
                            await conn.sendMessage(m.chat, { text: "❌ No se pudo descargar el video. Todas las APIs fallaron." }, { quoted: m });
                            return await m.react('❌');
                        }
                    }
                }
            }
        }

        // === Enviar video final ===
        await conn.sendMessage(
            m.chat,
            {
                document: { url: downloadUrl },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`,
                caption: `🎬 *${title}*\n\n🌚 *_Provided by KanBot_* 🌝`,
                jpegThumbnail: thumbnail ? await (await fetch(thumbnail)).buffer() : null
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
