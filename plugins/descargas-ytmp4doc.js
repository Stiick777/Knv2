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
    let title = "video";
    let download_url;
    let quality = "360";

    // ===================================================
    // ⭐ API PRINCIPAL: FAA
    // ===================================================
    try {
      const apiFaa = `https://api-faa.my.id/faa/ytmp4?url=${encodeURIComponent(url)}`;
      const resF = await fetch(apiFaa);
      const jsonF = await resF.json();

      if (!jsonF.status || !jsonF.result?.download_url)
        throw new Error('FAA inválida');

      download_url = jsonF.result.download_url;
      quality = jsonF.result.format || "mp4";
      title = "Video";

    } catch (e1) {
      console.warn("❌ FAA falló, usando respaldo Nexevo...");

      // ===================================================
      // 🔁 RESPALDO: NEXEVO
      // ===================================================
      const apiNexevo = `https://nexevo-api.vercel.app/download/y2?url=${encodeURIComponent(url)}`;
      const resN = await fetch(apiNexevo);
      const jsonN = await resN.json();

      if (!jsonN.status || !jsonN.result?.url)
        throw new Error('Nexevo inválida');

      download_url = jsonN.result.url;
      quality = jsonN.result.quality || "360";
      title = jsonN.result.info?.title || "Video";
    }

    // ===================================================
    // ⏳ Mensaje de espera
    // ===================================================
    let txt = '`🅓🅞🅒🅢 🅥➋ - 🅚🅐🅝🅑🅞🅣`\n\n';
    txt += `🍁 *Título*: ${title}\n`;
    txt += `🎞️ *Calidad*: ${quality}p\n\n`;
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
