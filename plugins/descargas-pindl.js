import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `*📌 Ingrese un enlace de Pinterest.*\n\n*💌 Ejemplo:* _${usedPrefix + command} https://pin.it/2Vflx5O_`,
      m
    );
  }

  if (!/(?:https?:\/\/)?(?:www\.)?(pin\.it|pinterest\.com)\/[^\s]+/gi.test(args[0])) {
    m.react('❌');
    return conn.reply(
      m.chat,
      `*📌 Ingrese un enlace válido de Pinterest.*\n\n*💌 Ejemplo:* _${usedPrefix + command} https://pin.it/2Vflx5O_`,
      m
    );
  }

  try {
    m.react('🕒');

    const { data } = await axios.get(
      `https://api.delirius.store/download/pinterestdl?url=${encodeURIComponent(args[0])}`
    );

    if (!data.status || !data.data) {
      m.react('❌');
      return conn.reply(m.chat, '*🚩 No se pudo procesar el enlace de Pinterest.*', m);
    }

    const info = data.data;

    const caption = `*📌 Título:* ${info.title || 'Sin título'}
*📝 Descripción:* ${info.description || 'Sin descripción'}
*👤 Autor:* ${info.author_name || 'Desconocido'} (${info.username || ''})
*📅 Subido:* ${info.upload || '-'}
💬 *Comentarios:* ${info.comments ?? 0}
❤️ *Likes:* ${info.likes ?? 0}

📥 *Descargado exitosamente.*`;

    await m.react('📤');

    if (info.download.type === 'video') {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: info.download.url },
          caption,
        },
        { quoted: m }
      );
    } else if (info.download.type === 'image') {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: info.download.url },
          caption,
        },
        { quoted: m }
      );
    } else {
      return conn.reply(m.chat, '⚠️ Tipo de archivo no soportado.', m);
    }

    m.react('✅');

  } catch (error) {
    console.error(error);
    m.react('❌');
    return conn.reply(m.chat, '*⚠️ Error al procesar la solicitud de Pinterest.*', m);
  }
};

handler.tags = ['descargas'];
handler.help = ['pindl <url>'];
handler.command = ['pindl'];
handler.group = true;

export default handler;
