const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de Facebook.*', m);
  }

  try {
    await m.react('⏳'); // Indicador de carga

    const apiUrl = `https://api.sylphy.xyz/download/facebook?url=${encodeURIComponent(args[0])}&apikey=sylphy-25c2`;
    const response = await fetch(apiUrl);
    const res = await response.json();

    if (!res || !res.status || !res.data) {
      await m.react('⚠️');
      return conn.reply(m.chat, '⚠️ *No se pudo obtener el video. Intenta con otro enlace.*', m);
    }

    const video = res.data.hd || res.data.sd;
    if (!video) {
      await m.react('🚩');
      return conn.reply(m.chat, '🚩 *No se encontró ningún enlace de video válido.*', m);
    }

    const calidad = res.data.hd ? 'HD' : 'SD';
    const duracion = res.data.duration || 'Desconocida';

    await m.react('📤');
    await conn.sendMessage(
      m.chat,
      {
        video: { url: video },
        caption: `🎬 *Descarga completada*\n\n📺 *Fuente:* Facebook\n💾 *Calidad:* ${calidad}\n⏱️ *Duración:* ${duracion}\n\nBy *KanBot* 🤖`,
        fileName: 'facebook_video.mp4',
        mimetype: 'video/mp4'
      },
      { quoted: m }
    );

    await m.react('✅');
  } catch (err) {
    console.error(err);
    await m.react('❌');
    return conn.reply(m.chat, '❌ *Error al procesar la descarga. Inténtalo de nuevo más tarde.*', m);
  }
};

handler.help = ['fb2'];
handler.tags = ['descargas'];
handler.command = ['facebook2', 'fb2'];
handler.group = true;

export default handler;
