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
    return star.reply(
      m.chat,
      '❌ Verifica que el enlace sea de YouTube.',
      m,
      rcanal
    ).then(() => m.react('✖️'));

  await m.react('🕓');

  try {
    const url = args[0];

    // ===================================================
    // ⭐ ÚNICA API: STARLIGHT
    // ===================================================
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(url)}&format=360p`;

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json?.dl_url)
      throw new Error('Respuesta inválida de Starlight');

    const title = json.title || "video";
    const quality = json.quality || "360p";
    const download_url = json.dl_url;

    // ===================================================
    // ⏳ Mensaje de espera
    // ===================================================
    let txt = '`🅓🅞🅒🅢 🅥➋ - 🅚🅐🅝🅑🅞🅣`\n\n';
    txt += `🍁 *Título*: ${title}\n`;
    txt += `🎞️ *Calidad*: ${quality}\n\n`;
    txt += `> *Se está enviando su video, por favor espere*`;

    await star.reply(m.chat, txt, m);

    // ===================================================
    // 📦 Enviar video como documento
    // ===================================================
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

    await m.react('✅');

  } catch (e) {
    console.error('Error descarga:', e.message);
    await m.react('✖️');
    return star.reply(
      m.chat,
      '❌ _*No se pudo descargar el video desde el servidor Starlight.*_',
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
