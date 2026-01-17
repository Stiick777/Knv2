import { webp2png } from '../lib/webp2png.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  const notStickerMessage = `Hubo un Error *${usedPrefix + command}*`

  const q = m.quoted || m
  const mime = q.mimetype || q.mediaType || ''

  if (!/webp/.test(mime)) return m.reply(notStickerMessage)

  const media = await q.download()

  let out
  try {
    out = await webp2png(media)
  } catch (e) {
    console.error(e)
    return m.reply('❌ Error al convertir el sticker')
  }

  await conn.sendFile(m.chat, out, 'sticker.png', null, m)
}

handler.help = ['toimg (reply)']
handler.tags = ['transformador']
handler.command = ['toimg', 'img', 'jpg']

export default handler
