import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw m.reply(
      `❗ Ingresa un link de Mediafire.\n\n✅ *Ejemplo:* ${usedPrefix}${command} https://www.mediafire.com/file/xxxxx/archivo.apk/file`
    );
  }

  // Validar link Mediafire
  const mediafireRegex = /^(https?:\/\/)?(www\.)?mediafire\.com\/file\/\S+/i;
  if (!mediafireRegex.test(text)) {
    return m.reply(
      '❌ El enlace ingresado no es válido.\n\n📌 Formato correcto:\nhttps://www.mediafire.com/file/...'
    );
  }

  // Reacción de espera
  await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    const apiUrl = `https://akirax-api.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.result?.downloadUrl) {
      return m.reply('❌ No se pudo obtener el enlace de descarga. Verifica que el link esté activo.');
    }

    const { fileName, downloadUrl } = json.result;

    // Enviar archivo
    await conn.sendFile(
      m.chat,
      downloadUrl,
      fileName,
      `📁 *Nombre:* ${fileName}\n🌐 *Fuente:* Mediafire`,
      m
    );

    // Reacción final
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
