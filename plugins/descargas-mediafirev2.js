import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Ingresa un link de Mediafire\n*✅ Ejemplo:* ${usedPrefix}${command} https://www.mediafire.com/file/efx4rdobvkgq8aa/Side-05.mp4/file`);
  }

  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    let res = await fetch(`https://bk9.fun/download/mediafire?url=${text}`);
    let json = await res.json();

    if (!json?.status || !json?.BK9?.link || json.BK9.link === '#' || !json.BK9.link.startsWith('http')) {
      return m.reply('No se pudo obtener un enlace válido desde Mediafire. Verifica el link o intenta con otro.');
    }

    await conn.sendFile(
      m.chat,
      json.BK9.link,
      json.BK9.name,
      `*🌙 Nombre:* ${json.BK9.name}\n*☘️ Tamaño:* ${json.BK9.size}\n*🎈 Tipo:* ${json.BK9.filetype}\n*📅 Subido:* ${json.BK9.uploaded}`,
      m
    );

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    m.reply('Ocurrió un error al procesar el enlace. Intenta nuevamente más tarde.');
  }
};

handler.help = ['mediafire2', 'mf2'];
handler.tags = ['descargas'];
handler.command = /^(mediafire2|mf2)$/i;
handler.group = true;

export default handler;