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
    return conn.reply(m.chat, '*☁️ Enlace de TikTok inválido.*', m);
  }

  try {
    m.react('🕒');

    const api = `https://api.vreden.my.id/api/v1/download/tiktok?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(api);

    if (!res.ok) throw new Error('API no respondió');

    const json = await res.json();

    if (!json.status || !json.result) {
      throw new Error('Respuesta inválida');
    }

    const r = json.result;

    const caption = `
*👤 Autor:* ${r.author?.nickname || 'Desconocido'}
*📝 Título:* ${r.title || 'Sin título'}
*⏱ Duración:* ${r.duration || 'Desconocida'}

📥 *Descargado por KanBot*
`.trim();

    const data = r.data || [];

    // ==============================
    // 🎥 VIDEO (prioridad HD)
    // ==============================
    const video =
      data.find(v => v.type === 'nowatermark_hd') ||
      data.find(v => v.type === 'nowatermark');

    // ==============================
    // 🖼 FOTOS (slides)
    // ==============================
    const photos = data.filter(v => v.type === 'photo');

    await m.react('📤');

    // ───────── FOTOS ─────────
    if (photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: photos[i].url },
            caption: i === 0 ? caption : undefined,
          },
          { quoted: m }
        );
      }

      // 🎵 Audio
      if (r.music_info?.url) {
        try {
          await conn.sendMessage(
            m.chat,
            {
              audio: { url: r.music_info.url },
              mimetype: 'audio/mpeg',
              ptt: false,
            },
            { quoted: m }
          );
        } catch (e) {
          console.log('⚠️ Audio no enviado:', e.message);
        }
      }

      m.react('✅');
      return;
    }

    // ───────── VIDEO ─────────
    if (video) {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: video.url },
          caption,
        },
        { quoted: m }
      );

      // 🎵 Audio opcional
      if (r.music_info?.url) {
        try {
          await conn.sendMessage(
            m.chat,
            {
              audio: { url: r.music_info.url },
              mimetype: 'audio/mpeg',
              ptt: false,
            },
            { quoted: m }
          );
        } catch (e) {
          console.log('⚠️ Audio no enviado:', e.message);
        }
      }

      m.react('✅');
      return;
    }

    throw new Error('No se encontró video ni fotos');

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
handler.command = ['tiktok', 'tt', 'ttdl', 'tiktokdl'];
handler.group = true;

export default handler;
