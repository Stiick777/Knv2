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

    // 1. Intentar como VIDEO
    const { data: videoData } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktok?url=${args[0]}`);

    // Detectar si es en realidad "foto" (photo mode)
    if (videoData.duration === 0 || videoData.size === 0) {
      // 2. Si es foto -> usar endpoint de imágenes
      const { data: imgData } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktok-images?url=${args[0]}`);
      const caption = `*📌 Titulo:* ${imgData.title}\n\n📥 *Descargado exitosamente by KanBot.*`;

      for (const img of imgData.images) {
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

      // Enviar el audio si existe
      if (videoData.audio) {
        await conn.sendMessage(
          m.chat,
          {
            audio: { url: videoData.audio },
            mimetype: 'audio/mp4',
            ptt: false,
          },
          { quoted: m }
        );
      }

      m.react('✅');
      return;
    }

    // 3. Si es realmente un video
    const caption = `*🎬 Título:* ${videoData.title || 'Sin título'}\n*📌 Autor:* ${videoData.author?.nickname || 'Desconocido'} (@${videoData.creator})\n*🌍 Región:* ${videoData.region || '??'}\n*▶️ Vistas:* ${videoData.views || 0}\n\n📥 *Descargado exitosamente by KanBot.*`;

    const videoUrl = videoData.hd || videoData.nowm || videoData.wm;
    if (!videoUrl) {
      m.react('❌');
      return conn.reply(m.chat, '*🚫 No se encontró un enlace de video válido.*', m);
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

    // 🚫 Aquí ya no se envía el audio en el caso de video

    m.react('✅');
  } catch (error) {
    console.error(error);
    m.react('❌');
    return conn.reply(m.chat, '*🌟 Error al procesar la solicitud. Intente con `/tt2`*', m);
  }
};

handler.tags = ['descargas'];
handler.help = ['tiktok'];
handler.command = ['tiktok', 'ttdl', 'tiktokdl', 'tiktoknowm', 'tt', 'ttnowm'];
handler.group = true;

export default handler;
