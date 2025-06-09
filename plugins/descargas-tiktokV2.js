import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    m.react('❌');
    return conn.reply(m.chat, `☁️ Ingrese un enlace de video de TikTok.\n\n💌 Ejemplo: _${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`, m);
  }

  if (!/(?:https?:\/\/)?(?:www|vm|vt|tiktok)\.com\/[^\s]+/gi.test(args[0])) {
    m.react('❌');
    return conn.reply(m.chat, `☁️ Ingrese un enlace válido de TikTok.\n\n💌 Ejemplo: _${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`, m);
  }

  try {
    m.react('🕒');
    const { data } = await axios.post('https://api.siputzx.my.id/api/tiktok/v2', { url: args[0] }, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    });

    if (!data.success) {
      m.react('❌');
      return conn.reply(m.chat, '🚩 Error al procesar el contenido.', m);
    }

    const info = data.data;
    const meta = info.metadata;
    const dl = info.download;

    const caption = `🎬 Descripción: ${meta.description || 'Sin descripción'}
📌 Región: ${meta.locationCreated || 'Desconocido'}
▶️ Reproducciones: ${meta.stats.playCount}
❤️ Me gusta: ${meta.stats.likeCount}
💬 Comentarios: ${meta.stats.commentCount}
🔁 Compartidos: ${meta.stats.shareCount}

📥 Contenido descargado exitosamente por KanBot.`;

    // Verificar si es foto
    if (dl.photo && dl.photo.length > 0) {
      for (const img of dl.photo) {
        await m.react('📤');
        await conn.sendMessage(
          m.chat,
          {
            image: { url: img },
            caption
          },
          { quoted: m }
        );
      }

      if (dl.audio) {
        await conn.sendMessage(
          m.chat,
          {
            audio: { url: dl.audio },
            mimetype: 'audio/mp4',
            ptt: false
          },
          { quoted: m }
        );
      }
    }
    // Verificar si es video
    else if (dl.video && dl.video.length > 0) {
      const videoUrl = dl.video[1] || dl.video[0]; // intenta HD primero
      if (!videoUrl) {
        m.react('❌');
        return conn.reply(m.chat, '*🚫 No se encontró un enlace de video válido.*', m);
      }

      await m.react('📤');
      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption
        },
        { quoted: m }
      );
    }

    m.react('✅');

  } catch (error) {
    console.error(error);
    m.react('❌');
    return conn.reply(m.chat, '🌟 Error al procesar la solicitud. Intente más tarde.', m);
  }
};

handler.tags = ['descargas'];
handler.help = ['tiktok2'];
handler.command = ['tiktok2', 'ttdl2', 'tt2'];
handler.group = true;

export default handler;