const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m, rcanal);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido.*', m, rcanal);
  }

  let res;
  const url = encodeURIComponent(args[0]);

  try {
    await m.react('⏳');

    // Intento 1: API principal (Ruby Core)
    let response = await fetch(`https://ruby-core.vercel.app/api/download/facebook?url=${url}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    if (!response.ok) throw new Error(`RubyCore HTTP ${response.status}`);
    res = await response.json();

    // Validar respuesta
    if (!res || res.true === false || !res.download) {
      throw new Error('Sin resultados válidos en RubyCore');
    }

  } catch (err) {
    console.warn('⚠️ Error en la API principal (RubyCore):', err.message);

    // Intento 2: API de respaldo (Starlight)
    try {
      await m.react('🌀');
      const backup = await fetch(`https://apis-starlights-team.koyeb.app/starlight/facebook?url=${url}`, {
        headers: { "Accept": "application/json" },
      });

      if (!backup.ok) throw new Error(`Starlight HTTP ${backup.status}`);
      res = await backup.json();

      if (!res || (!res.hd && !res.sd)) throw new Error('Sin resultados válidos en Starlight');
    } catch (backupErr) {
      console.error('❌ Error en la API de respaldo:', backupErr.message);
      await m.react('❌');
      return conn.reply(m.chat, `❎ *No se pudo obtener el video de ninguna API.*`, m, rcanal);
    }
  }

  // Selección de enlace (HD > SD > otro)
  const videoUrl = res.download || res.hd || res.sd;
  const title = res.metadata?.title || res.title || "Video de Facebook";

  try {
    await m.react('📤');
    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption: `🎥 *Facebook Video*\n📌 *Título:* ${title}\n✨ *_By KanBot_*`,
        fileName: 'facebook_video.mp4',
        mimetype: 'video/mp4',
      },
      { quoted: m }
    );
    await m.react('✅');
  } catch (err) {
    console.error('Error al enviar video:', err);
    await m.react('❌');
    return conn.reply(m.chat, `❌ *Error al enviar el video use /fb2:* ${err.message}`, m, rcanal);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
