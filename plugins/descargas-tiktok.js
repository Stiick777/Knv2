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
      `*☁️ Ingrese un enlace válido de TikTok.*\n\n*💌 Ejemplo:* _${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`,
      m
    );
  }

  try {
    m.react('🕒');

    const apiUrl = `https://api-adonix.ultraplus.click/download/tiktok?apikey=the.shadow&url=${encodeURIComponent(args[0])}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) {
      m.react('❌');
      return conn.reply(m.chat, '*🚫 No se pudo obtener el contenido.*', m);
    }

    const res = data.data;

    const caption = `
*👤 Autor:* ${res.author?.name || 'Desconocido'}
*❤️ Likes:* ${res.likes}
*💬 Comentarios:* ${res.comments}
*🔁 Compartidos:* ${res.shares}
*👀 Vistas:* ${res.views}

📥 *Descargado por KanBot*
`.trim();

    // 🖼️ POST DE IMÁGENES (Photo Mode)
    if (res.images && Array.isArray(res.images) && res.images.length > 0) {
      for (const img of res.images) {
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

      m.react('✅');
      return;
    }

    // 🎬 VIDEO
    if (res.video) {
      await m.react('📤');
      await conn.sendMessage(
        m.chat,
        {
          video: { url: res.video },
          caption,
        },
        { quoted: m }
      );

      m.react('✅');
      return;
    }

    m.react('❌');
    return conn.reply(m.chat, '*🚫 No se encontró video ni imágenes.*', m);

  } catch (err) {
    console.error(err);
    m.react('❌');
    return conn.reply(
      m.chat,
      '*🌟 Error al procesar el TikTok.*',
      m
    );
  }
};

handler.tags = ['descargas'];
handler.help = ['tiktok <url>'];
handler.command = ['tiktok', 'tt', 'ttdl', 'tiktokdl', 'ttnowm'];
handler.group = true;

export default handler;
