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

    const api = `https://api.ootaizumi.web.id/downloader/tiktok/v1?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(api);

    if (!res.ok) throw new Error('API no respondió');

    const json = await res.json();

    if (!json.status || !json.result) {
      throw new Error('Respuesta inválida');
    }

    const r = json.result;

    const caption = `
*👤 Autor:* ${r.author?.name || r.author?.username || 'Desconocido'}
*📝 Título:* ${r.title || 'Sin título'}
*❤️ Likes:* ${r.stats?.digg_count || 0}
*▶️ Views:* ${r.stats?.play_count || 0}

📥 *Descargado por KanBot*
`.trim();

    await m.react('📤');

    //=========================
    // 🎥 VIDEO
    //=========================
    if (r.type === 'video' && r.nowm) {

      await conn.sendMessage(
        m.chat,
        {
          video: { url: r.nowm },
          caption
        },
        { quoted: m }
      );

      // audio opcional
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
    // 🖼 FOTO/SLIDES
    //=========================
    if (r.type === 'image' && Array.isArray(r.image)) {

      for (let i = 0; i < r.image.length; i++) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: r.image[i] },
            caption: i === 0 ? caption : undefined
          },
          { quoted: m }
        );
      }

      // audio del slideshow
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
