const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m, rcanal);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido.*', m, rcanal);
  }

  let res;
  try {
    await m.react('⏳');
    const response = await fetch(
      `https://api.dorratz.com/v3/fb2?url=${encodeURIComponent(args[0])}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}...`);
    }

    res = await response.json();
  } catch (err) {
    console.error('Error en fetch:', err);
    await m.react('❌');
    return conn.reply(m.chat, `❎ *Error al obtener datos:* ${err.message}`, m, rcanal);
  }

  // Verificamos que tenga al menos un enlace válido
  const video = res.hd || res.sd;
  if (!video) {
    return conn.reply(m.chat, '🚩 *No se encontró un enlace de descarga válido.*', m, rcanal);
  }

  try {
    await m.react('📤');
    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: `🎈 *${res.title || 'Video de Facebook'}*\n📌 By KanBot`,
      fileName: 'facebook_video.mp4',
      mimetype: 'video/mp4'
    }, { quoted: m });
    await m.react('✅');
  } catch (err) {
    console.error('Error al enviar video:', err);
    await m.react('❌');
    return conn.reply(m.chat, `❌ *Error al enviar el video:* ${err.message}`, m, rcanal);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
