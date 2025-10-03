import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊*`, m, rcanal );
    }

    let youtubeLink = args[0];
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(youtubeLink)) {
        return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] Asegúrese de que sea un enlace de YouTube.*`, m, rcanal);
    }

    try {
        await m.react('🕓');

        let title, downloadUrl, thumbnail, quality;

        // === API 1: Ruby-Core ===
        try {
            const api1 = await fetch(`https://ruby-core.vercel.app/api/download/youtube/mp4?url=${encodeURIComponent(youtubeLink)}`);
            const res1 = await api1.json();

            if (!res1.status || !res1.download?.url) throw new Error("Ruby-Core inválido");

            title = res1.metadata.title;
            downloadUrl = res1.download.url;
            thumbnail = res1.metadata.thumbnail;
            quality = res1.download.quality;

        } catch (err1) {
            console.warn("Error Ruby-Core:", err1.message);

            // === API 2: Starlight ===
            try {
                const api2 = await fetch(`https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(youtubeLink)}`);
                const res2 = await api2.json();

                if (!res2.url || !res2.title) throw new Error("Starlight inválido");

                title = res2.title;
                downloadUrl = res2.url;
                thumbnail = res2.thumbnail;
                quality = res2.type || "Desconocida";

            } catch (err2) {
                console.warn("Error Starlight:", err2.message);

                // === API 3: Yupra ===
                try {
                    const api3 = await fetch(`https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeLink)}`);
                    const res3 = await api3.json();

                    if (!res3.status || !res3.result?.formats?.length) throw new Error("Yupra inválido");

                    const video = res3.result.formats.find(f => f.itag === 18) || res3.result.formats[0];
                    title = res3.result.title;
                    downloadUrl = video.url;
                    quality = video.qualityLabel;
                    thumbnail = null;

                } catch (err3) {
                    console.warn("Error Yupra:", err3.message);

                    // === API 4: Shylpy ===
                    try {
                        const api4 = await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(youtubeLink)}&apikey=sylphy-25c2`);
                        const res4 = await api4.json();

                        if (!res4.status || !res4.res?.url) throw new Error("Shylpy inválido");

                        title = res4.res.title;
                        downloadUrl = res4.res.url;
                        thumbnail = null;
                        quality = "360p";

                    } catch (err4) {
                        console.warn("Error Shylpy:", err4.message);

                        // === API 5: Stellar ===
                        try {
                            const api5 = await fetch(`https://api.stellarwa.xyz/dow/ytmp4v2?url=${encodeURIComponent(youtubeLink)}&apikey=stellar-53mIXDr2`);
                            const res5 = await api5.json();

                            if (!res5.status || !res5.data?.dl) throw new Error("Stellar inválido");

                            title = res5.data.title;
                            downloadUrl = res5.data.dl;
                            thumbnail = res5.data.thumbnail;
                            quality = "Desconocida";

                        } catch (err5) {
                            console.warn("Error Stellar:", err5.message);

                            // ❌ Todas fallaron
                            await conn.sendMessage(m.chat, { text: "❌ No se pudo descargar el video. Todas las APIs fallaron." }, { quoted: m });
                            return await m.react('✖️');
                        }
                    }
                }
            }
        }

        // ✅ Enviar video
        await conn.sendMessage(m.chat, {
            video: { url: downloadUrl },
            fileName: `${title}.mp4`,
            mimetype: 'video/mp4',
            caption: `😎 Su video by *_KanBot_*:\n\n*🎬 Título:* ${title}\n📌 *Calidad:* ${quality}`,
            jpegThumbnail: thumbnail ? await (await fetch(thumbnail)).buffer() : null
        }, { quoted: m });

        return await m.react('✅');

    } catch (error) {
        console.warn("Error general:", error.message);
        await m.react('❌');
        await conn.sendMessage(m.chat, { text: "❌ Error inesperado al procesar el enlace." }, { quoted: m });
    }
};

handler.tags = ['descargas'];
handler.help = ['ytv', 'ytmp4'];
handler.command = ['ytmp4', 'ytvideo', 'ytv'];
handler.group = true;

export default handler;