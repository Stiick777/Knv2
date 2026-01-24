import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `☁️ Ingrese un enlace de TikTok.\n\n💌 Ejemplo:\n_${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`,
      m
    );
  }

  if (!/(?:https?:\/\/)?(?:www|vm|vt|tiktok)\.com\/[^\s]+/gi.test(args[0])) {
    m.react('❌');
    return conn.reply(m.chat, '🚫 Enlace de TikTok no válido.', m);
  }

  try {
    m.react('🕒');

    const { data } = await axios.get(
      `https://api.vreden.my.id/api/v1/download/tiktok?url=${encodeURIComponent(args[0])}`
    );

    if (!data.status || !data.result) {
      m.react('❌');
      return conn.reply(m.chat, '🚩 Error al obtener el contenido.', m);
    }

    const info = data.result;

    const caption = `🎬 *Descripción:* ${info.title || 'Sin descripción'}
👤 *Autor:* ${info.author?.nickname || 'Desconocido'}
🌎 *Región:* ${info.region || 'N/A'}

📥 *Descargado por KanBot*`;

    // ===============================
    // 📸 MODO FOTOS (Photo Mode)
    // ===============================
    if (info.durations === 0 && info.data?.[0]?.type === 'photo') {
      for (const img of info.data) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: img.url },
            caption
          },
          { quoted: m }
        );
      }

      m.react('✅');
      return;
    }

    // ===============================
    // 🎥 MODO VIDEO
    // ===============================
    const videoHD = info.data.find(v => v.type === 'nowatermark_hd')?.url;
    const videoSD = info.data.find(v => v.type === 'nowatermark')?.url;

    const videoUrl = videoHD || videoSD;

    if (!videoUrl) {
      m.react('❌');
      return conn.reply(m.chat, '🚫 No se encontró video descargable.', m);
    }

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption
      },
      { quoted: m }
    );

    // 🎵 Enviar audio si existe
    if (info.music_info?.url) {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: info.music_info.url },
          mimetype: 'audio/mp4'
        },
        { quoted: m }
      );
    }

    m.react('✅');

  } catch (err) {
    console.error(err);
    m.react('❌');
    conn.reply(m.chat, '🌟 Error al procesar TikTok.', m);
  }
};

handler.tags = ['descargas'];
handler.help = ['tiktok2 <url>'];
handler.command = ['tiktok2', 'tt2', 'ttdl2'];
handler.group = true;

export default handler;
