import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `☁️ Ingrese un enlace de video de TikTok.\n\n💌 Ejemplo: _${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`,
      m
    );
  }

  if (!/(?:https?:\/\/)?(?:www|vm|vt|tiktok)\.com\/[^\s]+/gi.test(args[0])) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `☁️ Ingrese un enlace válido de TikTok.\n\n💌 Ejemplo: _${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`,
      m
    );
  }

  try {
    m.react('🕒');

    // 📌 USANDO TU API YUPRA
    const { data } = await axios.get(`https://api.yupra.my.id/api/downloader/tiktok?url=${encodeURIComponent(args[0])}`);

    if (!data.status || !data.result?.status) {
      m.react('❌');
      return conn.reply(m.chat, '🚩 Error al procesar el contenido.', m);
    }

    const info = data.result;

    const caption = `🎬 *Descripción:* ${info.title || 'Sin descripción'}
👤 *Autor:* ${info.author?.nickname || 'Desconocido'}
📌 *Región:* ${info.region || 'Desconocida'}

📥 *Contenido descargado exitosamente por KanBot.*`;

    // 📌 BUSCAMOS video sin marca de agua primero
    const noWm = info.data.find(x => x.type === "nowatermark")?.url;
    const hd = info.data.find(x => x.type === "nowatermark_hd")?.url;
    const wm = info.data.find(x => x.type === "watermark")?.url;

    const videoUrl = hd || noWm || wm;

    if (!videoUrl) {
      m.react('❌');
      return conn.reply(m.chat, '*🚫 No se encontró un video descargable.*', m);
    }

    await m.react('📤');
    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption
      },
      { quoted: m }
    );

    // 📌 Enviar música si está disponible
    if (info.music_info?.url) {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: info.music_info.url },
          mimetype: 'audio/mp4',
          ptt: false
        },
        { quoted: m }
      );
    }

    m.react('✅');

  } catch (error) {
    console.error(error);
    m.react('❌');
    return conn.reply(m.chat, '🌟 Error al procesar la solicitud. Intente más tarde.', m);
  }
};

handler.tags = ['descargas'];
handler.help = ['tiktok2'];
handler.command = ['tiktok2', 'tt2', 'ttdl2'];
handler.group = true;

export default handler;
