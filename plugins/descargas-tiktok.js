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
    if (!res.ok) throw new Error('API no respondió');

    const json = await res.json();
    if (!json.result?.status) throw new Error('Respuesta inválida');

    const r = json.result;

    const caption = `
*👤 Autor:* ${r.author?.nickname || 'Desconocido'}
*📝 Título:* ${r.title || 'Sin título'}
*⏱ Duración:* ${r.duration || 'Desconocida'}

📥 *Descargado por KanBot*
`.trim();

    const videoHD =
      r.data?.find(v => v.type === 'nowatermark_hd') ||
      r.data?.find(v => v.type === 'nowatermark') ||
      r.data?.find(v => v.type === 'watermark');

    await m.react('📤');

    // ─────── FOTO + AUDIO (slides / fotos) ───────
    if (!videoHD) {
      if (r.cover) {
        await conn.sendMessage(
          m.chat,
          { image: { url: r.cover }, caption },
          { quoted: m }
        );
      }

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

    // ─────── VIDEO ───────
    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoHD.url },
        caption,
      },
      { quoted: m }
    );

    // Audio opcional (NO debe romper el flujo)
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
