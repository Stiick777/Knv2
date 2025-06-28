/*
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw m.reply(`Ingresa un link de mediafire\n*✅ Ejemplo:* ${usedPrefix}${command} https://www.mediafire.com/file/2v2x1p0x58qomva/WhatsApp_Messenger_2.24.21.8_beta_By_WhatsApp_LLC.apk/file`);
  
  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
  
  let ouh = await fetch(`https://api.agatz.xyz/api/mediafire?url=${text}`)
  let gyh = await ouh.json()

  if (!gyh?.data?.[0]?.link || gyh.data[0].link === '#' || !gyh.data[0].link.startsWith('http')) {
    return m.reply('No se pudo obtener un enlace válido desde Mediafire. Verifica el link o intenta con /mf2.');
  }

  await conn.sendFile(m.chat, gyh.data[0].link, `${gyh.data[0].nama}`, `*🌙 Nombre:* ${gyh.data[0].nama}\n*☘️ Tamaño:* ${gyh.data[0].size}\n*🎈 Extensión:* ${gyh.data[0].mime}`, m)
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
}

handler.help = ['mediafire']
handler.tags = ['descargas']
handler.command = /^(mediafire|mf)$/i
handler.group = true;

export default handler
*/
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw m.reply(`❗ Ingresa un link de Mediafire.\n\n✅ *Ejemplo:* ${usedPrefix}${command} https://www.mediafire.com/file/1iu7hqs377e96uf/qioV19(Beal).zip/file`);
  
  // Validar que sea un enlace de mediafire
  const mediafireRegex = /^(https?:\/\/)?(www\.)?mediafire\.com\/file\/\S+/i;
  if (!mediafireRegex.test(text)) {
    return m.reply('❌ El enlace ingresado no es válido. Asegúrate de que sea un enlace de Mediafire.\n\n📌 Formato correcto:\nhttps://www.mediafire.com/file/...');
  }

  // Reacción de espera
  await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    // Petición a la API de Vreden
    let res = await fetch(`https://api.vreden.my.id/api/mediafiredl?url=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json?.result?.[0]?.link || !json.result[0].status) {
      return m.reply('❌ No se pudo obtener el enlace de descarga. Verifica que el link esté activo.');
    }

    let result = json.result[0];
    let { nama, size, mime, link } = result;

    // Enviar archivo
    await conn.sendFile(m.chat, link, nama, `📁 *Nombre:* ${decodeURIComponent(nama)}\n📦 *Tamaño:* ${size}\n📄 *Tipo:* ${mime}`, m);

    // Reacción final
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    return m.reply('⚠️ Error al procesar el enlace. Intenta nuevamente más tarde o use /mf2');
  }
};

handler.help = ['mediafire'];
handler.tags = ['descargas'];
handler.command = /^(mediafire|mf)$/i;
handler.group = true;

export default handler;
