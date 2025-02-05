import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `*☁️ Ingrese un enlace de video de TikTok.*\n\n*💌 Ejemplo:* _${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`,
      m
    );
  }

  if (!/(?:https:?\/{2})?(?:www|vm|vt|tiktok)\.com\/([^\s&]+)/gi.test(args[0])) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `*☁️ Ingrese un enlace válido de TikTok.*\n\n*💌 Ejemplo:* _${usedPrefix + command} https://vt.tiktok.com/ZS29uaYEv/_`,
      m
    );
  }

  try {
    m.react('🕒');

    const response = await axios.get(`https://api.vreden.web.id/api/tiktok?url=${args[0]}`);
    const result = response.data.result;

    if (result.status) {
      const videoUrl = result.data.find((item) => item.type === 'nowatermark_hd')?.url || result.data[0]?.url;
      const caption = `*🎥 Título:* ${result.title}\n*🕒 Duración:* ${result.duration}\n*🌍 Región:* ${result.region}\n*👤 Autor:* ${result.author.nickname}\n\n*📥 Video descargado con éxito by _KanBot_.*`;

      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: caption,
        },
        { quoted: m }
      );
      m.react('✅'); // React éxito
    } else {
      return conn.reply(m.chat, `*🚩 Error al descargar el video. Por favor, inténtalo nuevamente más tarde.*`, m);
    }
  } catch (error) {
    m.react('❌'); // React error
    return conn.reply(
      m.chat,
      `*🌟 Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde o use (/tt2).*`,
      m
    );
  }
};

handler.tags = ['descargas'];
handler.help = ['tiktok'];
handler.command = ['tiktok', 'ttdl', 'tiktokdl', 'tiktoknowm', 'tt', 'ttnowm', 'tiktokaudio'];
handler.group = true;

export default handler;
