/*
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw m.reply(`Ingresa un link de mediafire\n*✅ Ejemplo:* ${usedPrefix}${command} https://www.mediafire.com/file/2v2x1p0x58qomva/WhatsApp_Messenger_2.24.21.8_beta_By_WhatsApp_LLC.apk/file`);
conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
	let ouh = await fetch(`https://api.agatz.xyz/api/mediafire?url=${text}`)
  let gyh = await ouh.json()
	await conn.sendFile(m.chat, gyh.data[0].link, `${gyh.data[0].nama}`, `*🌙 Nombre:* ${gyh.data[0].nama}\n*☘️ Tamaño:* ${gyh.data[0].size}\n*🎈 Extensión:* ${gyh.data[0].mime}`, m)
	await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
}
handler.help = ['mediafire']
handler.tags = ['descargas']
handler.command = /^(mediafire|mf)$/i
handler.group = true;
export default handler
*/
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
