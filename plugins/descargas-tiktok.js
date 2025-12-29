import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `*☁️ Ingrese un enlace de TikTok.*\n\n*💌 Ejemplo:* _${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`,
      m
    );
  }

  if (!/(?:https?:\/\/)?(?:www|vm|vt|tiktok)\.com\/[^\s]+/gi.test(args[0])) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `*☁️ Ingrese un enlace válido de TikTok.*`,
      m
    );
  }

  try {
    m.react('🕒');

    const apiUrl = `https://api.stellarwa.xyz/dl/tiktok?key=this-xyz&url=${encodeURIComponent(args[0])}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) {
      m.react('❌');
      return conn.reply(m.chat, '*🚫 No se pudo obtener el contenido.*', m);
    }

    const res = data.data;

    const caption = `
*👤 Autor:* ${res.author?.nickname || 'Desconocido'}
*❤️ Likes:* ${res.stats?.likes || 0}
*💬 Comentarios:* ${res.stats?.comments || 0}
*🔁 Compartidos:* ${res.stats?.shares || 0}
*👀 Vistas:* ${res.stats?.plays || 0}

📥 *Descargado por KanBot*
`.trim();

    // 🖼️ IMÁGENES (Photo Mode)
    if (res.type === 'image' && Array.isArray(res.dl)) {
      for (const img of res.dl) {
        await m.react('📤');
        await conn.sendMessage(
          m.chat,
          {
            image: { url: img },
            caption,
          },
          { quoted: m }
        );
      }

      // 🔊 AUDIO (si está disponible)
      if (res.music?.play) {
        await conn.sendMessage(
          m.chat,
          {
            audio: { url: res.music.play },
            mimetype: 'audio/mp4',
            ptt: false,
          },
          { quoted: m }
        );
      }

      m.react('✅');
      return;
    }

    // 🎬 VIDEO
    if (res.type === 'video' && res.dl) {
      await m.react('📤');
      await conn.sendMessage(
        m.chat,
        {
          video: { url: res.dl },
          caption,
        },
        { quoted: m }
      );

      m.react('✅');
      return;
    }

    m.react('❌');
    return conn.reply(m.chat, '*🚫 No se encontró contenido descargable.*', m);

  } catch (err) {
    console.error(err);
    m.react('❌');
    return conn.reply(
      m.chat,
      '*🌟 Error al procesar el TikTok use tt2*',
      m
    );
  }
};

handler.tags = ['descargas'];
handler.help = ['tiktok <url>'];
handler.command = ['tiktok', 'tt', 'ttdl', 'tiktokdl'];
handler.group = true;

export default handler;
