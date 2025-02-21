import fetch from 'node-fetch';

let handler = async (m, { conn: star, args }) => {
  if (!args || !args[0]) 
    return star.reply(m.chat, '💣 _*Ingresa el enlace del video de YouTube junto al comando.*_\n\n`Ejemplo:`\n> *!ytmp4doc* https://youtube.com/watch?v=qHDJSRlNhVs', m, );

  if (!args[0].match(/youtu/gi)) 
    return star.reply(m.chat, `Verifica que el enlace sea de YouTube.`, m, rcanal).then(() => m.react('✖️'));

  await m.react('🕓'); // Reaccionar con reloj mientras procesa

try {
    let v = args[0];

    // Primera API
    let apiResponse = await fetch(`https://apidl.asepharyana.cloud/api/downloader/ytmp4?url=${encodeURIComponent(v)}&quality=360`);
    let data = await apiResponse.json();

    if (!data.url || !data.filename) throw new Error('Error en la primera API');

    let { filename, url: download_url } = data;

    let txt = '`🅓🅞🅒🅢 🅥➋ - 🅚🅐🅝🅑🅞🅣`\n\n';
    txt += `	🍁   *Título*: ${filename}\n`;
    txt += `	🎥   *Calidad*: 360p\n\n`;
    txt += `> ️ *Se está enviando su video, por favor espere*`;

    await star.reply(m.chat, txt, m);
    await star.sendMessage(m.chat, {
        document: { url: download_url }, 
        caption: `${filename}\n🎥 *Calidad*: 360p\n\n🌝 *Provided by KanBot* 🌚`,
        mimetype: 'video/mp4',
        fileName: filename
    }, { quoted: m });

    return await m.react('✅'); // Reaccionar con éxito
} catch (e) {
    console.warn("Error en la primera API:", e.message);

    try {
        let v = args[0];

        // Segunda API (respaldo)
        let apiResponse = await fetch(`https://api.agungny.my.id/api/youtube-video?url=${encodeURIComponent(v)}`);
        let data = await apiResponse.json();

        if (data.status !== "true") throw new Error('Error en la segunda API');

        let { title, downloadUrl } = data.result;

        await star.sendMessage(m.chat, {
            document: { url: downloadUrl }, 
            caption: `${title}\n\n🌝 *Provided by KanBot* 🌚`,
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`
        }, { quoted: m });

        return await m.react('✅'); // Reaccionar con éxito
    } catch (backupError) {
        console.error("Error en la segunda API:", backupError.message);
        await m.react('✖️');
        await star.reply(m.chat, '❌ _*Error al procesar el enlace. Por favor, intenta de nuevo.*_', m);
    }
}
};

handler.help = ['ytmp4doc *<link yt>*'];
handler.tags = ['descargas'];
handler.command = ['ytmp4doc', 'yt4doc'];
handler.group = true;

export default handler;