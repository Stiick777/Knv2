
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
    await m.react('⏳'); // cargando

    const apiUrl = `https://api.dorratz.com/v3/fb2?url=${encodeURIComponent(args[0])}`;
    const response = await fetch(apiUrl);
    const res = await response.json();

    if (!res || (!res.sd && !res.hd)) {
      await m.react('⚠️');
      return conn.reply(m.chat, '⚠️ *No se pudo obtener el video. Intenta con otro enlace.*', m);
    }

    const video = res.hd || res.sd;
    const calidad = res.hd ? 'HD' : 'SD';

    const duracion = res.duration_ms
      ? `${Math.floor(res.duration_ms / 1000)} segundos`
      : 'Desconocida';

    // Decodificar título por si viene con entidades HTML
    const decodeHTML = (texto) => {
      return texto
        .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(dec));
    };

    const titulo = res.title ? decodeHTML(res.title) : 'Sin título';

    await m.react('📤');

    await conn.sendMessage(
      m.chat,
      {
        video: { url: video },
        caption: `🎬 *Descarga completada*\n\n📺 *Fuente:* Facebook\n💾 *Calidad:* ${calidad}\n⏱️ *Duración:* ${duracion}\n📝 *Título:* ${titulo}\n\nBy *KanBot* 🤖`,
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

handler.help = ['fb2'];
handler.tags = ['descargas'];
handler.command = ['facebook2', 'fb2'];
handler.group = true;

export default handler;
