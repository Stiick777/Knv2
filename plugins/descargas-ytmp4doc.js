import fetch from 'node-fetch';

let handler = async (m, { conn: star, args }) => {
  if (!args || !args[0]) 
    return star.reply(m.chat, '💣 _*Ingresa el enlace del video de YouTube junto al comando.*_\n\n`Ejemplo:`\n> *!ytmp4doc* https://youtube.com/watch?v=qHDJSRlNhVs', m, rcanal);

  if (!args[0].match(/youtu/gi)) 
    return star.reply(m.chat, `Verifica que el enlace sea de YouTube.`, m, rcanal).then(() => m.react('✖️'));

  await m.react('🕓'); // Reaccionar con reloj mientras procesa

try {
    let v = args[0];
    let title, download_url, thumbnail;

    // === API PRINCIPAL (Starlight) ===
    try {
        let apiResponse1 = await fetch(`https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(v)}`);
        let data1 = await apiResponse1.json();

        if (!data1.url || !data1.title) {
            throw new Error('Respuesta inválida de Starlight');
        }

        title = data1.title;
        download_url = data1.url;
        thumbnail = data1.thumbnail;

    } catch (err1) {
        console.warn("Error con Starlight, intentando con Delirius:", err1.message);

        // === API RESPALDO 1 (Delirius) ===
        try {
            let apiResponse2 = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp4?url=${encodeURIComponent(v)}`);
            let data2 = await apiResponse2.json();

            if (!data2.status || !data2.data || !data2.data.download) {
                throw new Error('Respuesta inválida de Delirius');
            }

            title = data2.data.title;
            download_url = data2.data.download.url;
            thumbnail = data2.data.image;

        } catch (err2) {
            console.warn("Error con Delirius, intentando con StellarWA:", err2.message);

            // === API RESPALDO 2 (StellarWA) ===
            try {
                let apiResponse3 = await fetch(`https://api.stellarwa.xyz/dow/ytmp4v2?url=${encodeURIComponent(v)}&apikey=stellar-p1N9EsSo`);
                let data3 = await apiResponse3.json();

                if (!data3.status || !data3.data || !data3.data.dl || !data3.data.title) {
                    throw new Error('Respuesta inválida de StellarWA');
                }

                title = data3.data.title;
                download_url = data3.data.dl;
                thumbnail = data3.data.thumbnail;

            } catch (err3) {
                console.warn("Error con StellarWA, intentando con Sylphy:", err3.message);

                // === API RESPALDO 3 (Sylphy) ===
                try {
                    let apiResponse4 = await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(v)}&apikey=sylphy-25c2`);
                    let data4 = await apiResponse4.json();

                    if (!data4.status || !data4.res || !data4.res.url || !data4.res.title) {
                        throw new Error('Respuesta inválida de Sylphy');
                    }

                    title = data4.res.title;
                    download_url = data4.res.url;
                    thumbnail = null;

                } catch (err4) {
                    console.warn("Error con Sylphy, intentando con Vreden:", err4.message);

                    // === API RESPALDO 4 (Vreden) ===
                    let apiResponse5 = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(v)}`);
                    let data5 = await apiResponse5.json();

                    if (!data5.result || !data5.result.download || !data5.result.metadata) {
                        throw new Error('Respuesta inválida de Vreden');
                    }

                    title = data5.result.metadata.title;
                    download_url = data5.result.download.url;
                    thumbnail = data5.result.metadata.thumbnail;
                }
            }
        }
    }

    // === Mensaje de espera ===
    let txt = '`🅓🅞🅒🅢 🅥➋ - 🅚🅐🅝🅑🅞🅣`\n\n';
    txt += `	🍁   *Título*: ${title}\n\n`;
    txt += `> ️ *Se está enviando su video, por favor espere*`;

    await star.reply(m.chat, txt, m);

    // === Enviar el video como documento ===
    await star.sendMessage(m.chat, {
        document: { url: download_url },
        caption: `🌝 *Provided by KanBot* 🌚`,
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        jpegThumbnail: thumbnail ? await (await fetch(thumbnail)).buffer() : null
    }, { quoted: m });

    return await m.react('✅'); // Reacción de éxito

} catch (error) {
    console.error("Error en la API:", error.message);
    await m.react('✖️');
    await star.reply(m.chat, '❌ _*Error al procesar el enlace. Por favor, intenta de nuevo.*_', m, rcanal);
}
//
};

handler.help = ['ytmp4doc *<link yt>*'];
handler.tags = ['descargas'];
handler.command = ['ytmp4doc', 'yt4doc'];
handler.group = true;

export default handler;
