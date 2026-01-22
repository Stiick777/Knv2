import fetch from 'node-fetch';

let handler = async (m, { conn: star, args }) => {
  if (!args || !args[0]) 
    return star.reply(
      m.chat,
      '💣 _*Ingresa el enlace del video de YouTube junto al comando.*_\n\n`Ejemplo:`\n> *!ytmp4doc* https://youtube.com/watch?v=qHDJSRlNhVs',
      m,
      rcanal
    );

  if (!args[0].match(/youtu/gi)) 
    return star.reply(m.chat, '❌ Verifica que el enlace sea de YouTube.', m, rcanal)
      .then(() => m.react('✖️'));

  await m.react('🕓');

  try {
    let url = args[0];

    // === API YUPRA ===
    let res = await fetch(
      `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`
    );
    let json = await res.json();

    if (!json.success || !json.data?.download_url)
      throw new Error('Respuesta inválida de Yupra');

    let title = json.data.title || 'video';
    let download_url = json.data.download_url;
    let quality = json.data.format || 'MP4';

    // === Mensaje de espera ===
    let txt = '`🅓🅞🅒🅢 🅥➋ - 🅚🅐🅝🅑🅞🅣`\n\n';
    txt += `🍁 *Título*: ${title}\n`;
    txt += `🎞️ *Calidad*: ${quality}p\n\n`;
    txt += `> *Se está enviando su video, por favor espere*`;

    await star.reply(m.chat, txt, m);

    // === Enviar video como documento ===
    await star.sendMessage(
      m.chat,
      {
        document: { url: download_url },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: '🌝 *Provided by KanBot* 🌚'
      },
      { quoted: m }
    );

    return await m.react('✅');

  } catch (e) {
    console.error('Error Yupra:', e.message);
    await m.react('✖️');
    return star.reply(
      m.chat,
      '❌ _*No se pudo descargar el video. Intenta más tarde.*_',
      m,
      rcanal
    );
  }
};

handler.help = ['ytmp4doc <link yt>'];
handler.tags = ['descargas'];
handler.command = ['ytmp4doc', 'yt4doc'];
handler.group = true;

export default handler;
