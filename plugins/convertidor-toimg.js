import fetch from 'node-fetch'
import FormData from 'form-data'

const LOLHUMAN_APIKEY = '8fdb6bf3e9d527f7a6476f4b'

// Subir imagen a telegra.ph
async function uploadImage(buffer) {
  const form = new FormData()
  form.append('file', buffer, 'image.webp')

  const res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  })

  const data = await res.json()
  if (!data[0]?.src) throw new Error('Error al subir imagen')

  return 'https://telegra.ph' + data[0].src
}

let handler = async (m, { conn, usedPrefix, command }) => {
  const notStickerMessage = `❌ Responde a un *sticker* con *${usedPrefix + command}*`

  const q = m.quoted || m
  const mime = q.mimetype || q.mediaType || ''

  if (!/webp/.test(mime)) return m.reply(notStickerMessage)

  try {
    const media = await q.download()

    // 1. Subir sticker
    const imgUrl = await uploadImage(media)

    // 2. Convertir con lolhuman
    const apiUrl = `https://api.lolhuman.xyz/api/convert/topng?apikey=${LOLHUMAN_APIKEY}&img=${encodeURIComponent(imgUrl)}`

    // 3. Enviar imagen
    await conn.sendFile(m.chat, apiUrl, 'sticker.png', null, m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al convertir el sticker a imagen')
  }
}

handler.help = ['toimg (reply)']
handler.tags = ['transformador']
handler.command = ['toimg', 'img', 'jpg']

export default handler
