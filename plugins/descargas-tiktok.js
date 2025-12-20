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

    const apiUrl = `https://akirax-api.vercel.app/download/tiktok?url=${encodeURIComponent(args[0])}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status) {
      m.react('❌');
      return conn.reply(m.chat, '*🚫 No se pudo obtener el contenido.*', m);
    }

    const res = data.result;

    const caption = `
*👤 Autor:* ${res.author.nickname}
*🎵 Música:* ${res.music?.title || 'Sin música'}
📥 *Descargado por KanBot*
`.trim();

    // 🖼️ SI ES POST DE IMÁGENES
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

      // 🎧 Audio si existe
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

    // 🎬 SI ES VIDEO
    const videoUrl = res.video?.no_watermark || res.video?.watermark;

    if (!videoUrl) {
      m.react('❌');
      return conn.reply(m.chat, '*🚫 No se encontró video ni imágenes.*', m);
    }

    await m.react('📤');
    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption,
      },
      { quoted: m }
    );

    m.react('✅');
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
