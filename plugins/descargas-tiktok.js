import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `*☁️ Ingrese un enlace de TikTok.*\n\n*💌 Ejemplo:* _${usedPrefix + command} https://vt.tiktok.com/xxxxx/_`,
      m
    );
  }

  if (!/(?:https?:\/\/)?(?:www|vm|vt|tiktok)\.com\/[^\s]+/gi.test(args[0])) {
    m.react('❌');
    return conn.reply(
      m.chat,
      '*☁️ Enlace de TikTok inválido.*',
      m
    );
  }

  try {
    m.react('🕒');

    const api = `https://api.yupra.my.id/api/downloader/tiktok?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(api);

    if (!res.ok) throw new Error('API no respondió');

    const json = await res.json();

    if (json.status !== 200 || !json.result) {
      throw new Error('Respuesta inválida');
    }

    const r = json.result;

    const caption = `
*👤 Autor:* ${r.author?.nickname || r.author?.username || 'Desconocido'}
*📝 Título:* ${r.title || 'Sin título'}
*❤️ Likes:* ${r.like || 0}
*👁 Views:* ${r.views || 0}
*🔁 Shares:* ${r.share || 0}
*💬 Comentarios:* ${r.comment || 0}

📥 *Descargado por KanBot*
`.trim();

    await m.react('📤');

    //=========================
    // 🎥 VIDEO
    //=========================
    if (r.isVideo && r.download) {

      await conn.sendMessage(
        m.chat,
        {
          video: { url: r.download },
          caption
        },
        { quoted: m }
      );

      // 🎵 Audio
      if (r.music?.url) {
        try {
          await conn.sendMessage(
            m.chat,
            {
              audio: { url: r.music.url },
              mimetype: 'audio/mpeg',
              ptt: false
            },
            { quoted: m }
          );
        } catch (e) {
          console.log('Audio no enviado:', e.message);
        }
      }

      m.react('✅');
      return;
    }

    //=========================
    // 🖼 IMÁGENES / SLIDES
    //=========================
    if (!r.isVideo && Array.isArray(r.download)) {

      for (let i = 0; i < r.download.length; i++) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: r.download[i] },
            caption: i === 0 ? caption : undefined
          },
          { quoted: m }
        );
      }

      // 🎵 Audio del slideshow
      if (r.music?.url) {
        try {
          await conn.sendMessage(
            m.chat,
            {
              audio: { url: r.music.url },
              mimetype: 'audio/mpeg',
              ptt: false
            },
            { quoted: m }
          );
        } catch (e) {
          console.log('Audio no enviado:', e.message);
        }
      }

      m.react('✅');
      return;
    }

    throw new Error('No se encontró contenido');

  } catch (err) {
    console.error('❌ TikTok Error:', err);
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
handler.command = ['tiktok','tt','ttdl','tiktokdl'];
handler.group = true;

export default handler;
