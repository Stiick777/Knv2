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
      `https://ruby-core.vercel.app/api/download/facebook?url=${encodeURIComponent(args[0])}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
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

  if (!res || res.true === false || !res.download) {
    return conn.reply(m.chat, '⚠️ *No se encontraron resultados o enlaces de descarga.*', m, rcanal);
  }

  const videoUrl = res.download;
  const title = res.metadata?.title || "Video de Facebook";
  const description = res.metadata?.description || "Sin descripción disponible.";

  try {
    await m.react('📤');
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `🎥 *Facebook Video*\n📌 *Título:* ${title}\n📝 *Descripción:* ${description}\n✨ *By KanBot*`,
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
