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
    const { data } = await axios.get(`https://api.diioffc.web.id/api/download/tiktok?url=${args[0]}`);

    if (!data.status) {
      m.react('❌');
      return conn.reply(m.chat, '🚩 Error al procesar el contenido.', m);
    }

    const info = data.result;
    const caption = `🎬 Descripción: ${info.title || 'Sin descripción'}
👤 Autor: ${info.author?.nickname || 'Desconocido'}
📌 Región: ${info.region || 'Desconocida'}
▶️ Reproducciones: ${info.play_count}
❤️ Me gusta: ${info.digg_count}
💬 Comentarios: ${info.comment_count}
🔁 Compartidos: ${info.share_count}

📥 Contenido descargado exitosamente por KanBot.`;

    // Si es imagen (photomode)
    if (info.images && info.images.length > 0) {
      for (const img of info.images) {
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

      if (info.music) {
        await conn.sendMessage(
          m.chat,
          {
            audio: { url: info.music },
            mimetype: 'audio/mp4',
            ptt: false
          },
          { quoted: m }
        );
      }
    } 
    // Si es video
    else if (info.play) {
      const videoUrl = info.hdplay || info.play; // intenta HD primero
      await m.react('📤');
      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption
        },
        { quoted: m }
      );
    } else {
      m.react('❌');
      return conn.reply(m.chat, '*🚫 No se encontró un enlace válido de video o imagen.*', m);
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
handler.command = ['tiktok2', 'tt2', 'ttdl2'];
handler.group = true;

export default handler;
