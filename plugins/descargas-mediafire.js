import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw m.reply(
      `❗ Ingresa un link de Mediafire (archivo o carpeta).\n\n✅ *Ejemplo:*\n${usedPrefix}${command} https://www.mediafire.com/folder/xxxxx/carpeta`
    );
  }

  // Validar link Mediafire (file o folder)
  const mediafireRegex = /^(https?:\/\/)?(www\.)?mediafire\.com\/(file|folder)\/\S+/i;
  if (!mediafireRegex.test(text)) {
    return m.reply(
      '❌ El enlace ingresado no es válido.\n\n📌 Formato correcto:\nhttps://www.mediafire.com/file/...\nhttps://www.mediafire.com/folder/...'
    );
  }

  await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    const apiUrl = `https://api.delirius.store/download/mediafire?url=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.length) {
      return m.reply('❌ No se encontraron archivos en el enlace proporcionado.');
    }

    const files = json.data;

    await m.reply(`📂 *Carpeta detectada*\n📦 Total de archivos: ${files.length}\n\n⏳ Enviando archivos...`);

    for (let file of files) {
      const caption = `📁 *Nombre:* ${file.filename}
📦 *Peso:* ${(Number(file.size) / 1024 / 1024).toFixed(2)} MB
📅 *Subido:* ${file.uploaded}
🌐 *Fuente:* Mediafire`;

      await conn.sendFile(
        m.chat,
        file.link,
        file.filename,
        caption,
        m
      );
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    return m.reply('⚠️ Error al procesar el enlace. Intenta nuevamente más tarde.');
  }
};

handler.help = ['mediafire', 'mf'];
handler.tags = ['descargas'];
handler.command = /^(mediafire|mf)$/i;
handler.group = true;

export default handler;
