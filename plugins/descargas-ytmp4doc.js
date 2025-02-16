import fetch from 'node-fetch';

let handler = async (m, { conn: star, args }) => {
  if (!args || !args[0]) 
    return star.reply(m.chat, '💣 _*Ingresa el enlace del video de YouTube junto al comando.*_\n\n`Ejemplo:`\n> *!ytmp4doc* https://youtube.com/watch?v=qHDJSRlNhVs', m, );

  if (!args[0].match(/youtu/gi)) 
    return star.reply(m.chat, `Verifica que el enlace sea de YouTube.`, m, ).then(() => m.react('✖️'));

  await m.react('🕓');
  try {
    let v = args[0];

    let apiResponse = await fetch(`https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(v)}`);
    let data = await apiResponse.json();

    if (!data.success) throw new Error('Error en la descarga');

    let { title, download_url, quality } = data.result;

    let txt = '`🅓🅞🅒🅢 🅥➋ - 🅚🅐🅝🅑🅞🅣`\n\n';
    txt += `	🍁   *Título*: ${title}\n`;
    txt += `	🎥   *Calidad*: ${quality}\n\n`;
    txt += `> ️ *Se está enviando su video, por favor espere*`;

    await star.reply(m.chat, txt, m, );
    await star.sendMessage(m.chat, {
      document: { url: download_url }, // Enlace directo para descargar el archivo como documento
      caption: `${title}\n🎥 *Calidad*: ${quality}\n\n*🌝 *Provided by KanBot* 🌚`,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4` // Nombre del archivo con extensión
    }, { quoted: m });
    await m.react('✅');
} catch (e) {
    console.error(e);
    await m.react('✖️');
    star.reply(m.chat, '❌ _*Error al procesar el enlace. Por favor, intenta de nuevo.*_', m);
}
};

handler.help = ['ytmp4doc *<link yt>*'];
handler.tags = ['descargas'];
handler.command = ['ytmp4doc', 'yt4doc'];
handler.group = true;

export default handler;
