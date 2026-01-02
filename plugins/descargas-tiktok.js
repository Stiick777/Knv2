import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `*☁️ Ingrese un enlace de TikTok.*\n\n*💌 Ejemplo:* _${usedPrefix + command} https://vt.tiktok.com/ZS5SJjDJr/_`,
      m
    );
  }

  if (!/(?:https?:\/\/)?(?:www|vm|vt|tiktok)\.com\/[^\s]+/gi.test(args[0])) {
    m.react('❌');
    return conn.reply(m.chat, '*☁️ Enlace de TikTok inválido.*', m);
  }

  try {
    m.react('🕒');

    const { data } = await axios.post(
      'https://api.xyro.site/download/tiktokv1',
      new URLSearchParams({ url: args[0] }).toString(),
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!data || !data.video) {
      m.react('❌');
      return conn.reply(m.chat, '*🚫 No se pudo obtener el contenido.*', m);
    }

    const caption = `
*👤 Autor:* ${data.author || 'Desconocido'}

📥 *Descargado por KanBot*
`.trim();

    // 🖼️ PHOTO MODE (TikTok imágenes)
    // Cuando el "video" es en realidad audio (mp3)
    if (data.video.endsWith('.mp3')) {
      await m.react('📤');

      await conn.sendMessage(
        m.chat,
        {
          image: { url: data.thumbnail },
          caption,
        },
        { quoted: m }
      );

      if (data.audio) {
        await conn.sendMessage(
          m.chat,
          {
            audio: { url: data.audio },
            mimetype: 'audio/mp4',
            ptt: false,
          },
          { quoted: m }
        );
      }

      m.react('✅');
      return;
    }

    // 🎬 VIDEO NORMAL
    await m.react('📤');
    await conn.sendMessage(
      m.chat,
      {
        video: { url: data.video },
        caption,
      },
      { quoted: m }
    );

    // 🔊 AUDIO (opcional)
    if (data.audio) {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: data.audio },
          mimetype: 'audio/mp4',
          ptt: false,
        },
        { quoted: m }
      );
    }

    m.react('✅');

  } catch (err) {
    console.error(err);
    m.react('❌');
    return conn.reply(
      m.chat,
      '*🌟 Error al procesar el TikTok, intenta más tarde.*',
      m
    );
  }
};

handler.tags = ['descargas'];
handler.help = ['tiktok <url>'];
handler.command = ['tiktok', 'tt', 'ttdl', 'tiktokdl'];
handler.group = true;

export default handler;
