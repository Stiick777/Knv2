import fetch from 'node-fetch';

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

    const api = `https://api.yupra.my.id/api/downloader/tiktok?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json.result?.status) {
      throw new Error('Respuesta inválida de YUPRA');
    }

    const r = json.result;

    // ─── CAPTION ───
    const caption = `
*👤 Autor:* ${r.author?.nickname || 'Desconocido'}
*📝 Título:* ${r.title}
*⏱ Duración:* ${r.duration}

📥 *Descargado por KanBot*
`.trim();

    // ─── SELECCIONAR MEJOR VIDEO ───
    const videoHD =
      r.data.find(v => v.type === 'nowatermark_hd') ||
      r.data.find(v => v.type === 'nowatermark') ||
      r.data.find(v => v.type === 'watermark');

    // ─────────────────────────────
    // 📸 PHOTO / AUDIO MODE
    // (cuando TikTok no es video real)
    // ─────────────────────────────
    if (!videoHD) {
      await m.react('📤');

      // Enviar cover
      if (r.cover) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: r.cover },
            caption,
          },
          { quoted: m }
        );
      }

      // Enviar audio
      if (r.music_info?.url) {
        await conn.sendMessage(
          m.chat,
          {
            audio: { url: r.music_info.url },
            mimetype: 'audio/mpeg',
            ptt: false,
          },
          { quoted: m }
        );
      }

      await m.react('✅');
      return;
    }

    // ─────────────────────────────
    // 🎬 VIDEO MODE (normal)
    // ─────────────────────────────
    await m.react('📤');

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoHD.url },
        caption,
      },
      { quoted: m }
    );

    // 🔊 Audio opcional
    if (r.music_info?.url) {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: r.music_info.url },
          mimetype: 'audio/mpeg',
          ptt: false,
        },
        { quoted: m }
      );
    }

    await m.react('✅');

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
