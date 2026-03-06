const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(
      m.chat,
      '❌ *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de Facebook.*',
      m
    );
  }

  try {
    await m.react('⏳');

    const apiUrl = `https://api-faa.my.id/faa/fbdownload?url=${encodeURIComponent(args[0])}`;
    const response = await fetch(apiUrl);
    const res = await response.json();

    if (!res.status || !res.result) {
      await m.react('⚠️');
      return conn.reply(m.chat, '⚠️ *No se pudo obtener el video.*', m);
    }

    const data = res.result;
    const video = data.media.video_hd || data.media.video_sd;

    if (!video) {
      await m.react('⚠️');
      return conn.reply(m.chat, '⚠️ *No se encontró un video descargable.*', m);
    }

    const calidad = data.media.video_hd ? 'HD' : 'SD';
    const titulo = data.info.title || 'Sin título';

    const duracion = data.info.duration
      ? `${Math.floor(data.info.duration / 1000)} segundos`
      : 'Desconocida';

    await m.react('📤');

    await conn.sendMessage(
      m.chat,
      {
        video: { url: video },
        caption: `🎬 *Descarga completada*

📺 *Fuente:* Facebook
💾 *Calidad:* ${calidad}
⏱️ *Duración:* ${duracion}
📝 *Título:* ${titulo}

By *KanBot* 🤖`,
        fileName: 'facebook_video.mp4',
        mimetype: 'video/mp4'
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error(err);
    await m.react('❌');
    return conn.reply(
      m.chat,
      '❌ *Error al procesar la descarga. Inténtalo de nuevo más tarde.*',
      m
    );
  }
};

handler.help = ['fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
