/*
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import fluent from 'fluent-ffmpeg'
//import Sticker from 'wa-sticker-formatter'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'

let handler = async (m, { conn, args }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  let buffer

  try {
    if (/image|video/g.test(mime) && q.download) {
      if (/video/.test(mime) && (q.msg || q).seconds > 11)
        return conn.reply(m.chat, '[ ✰ ] El video no puede durar más de *10 segundos*', m)
      buffer = await q.download()
    } else if (args[0] && isUrl(args[0])) {
      const res = await fetch(args[0])
      buffer = await res.buffer()
    } else {
      return conn.reply(m.chat, '[ ✰ ] Responde a una *imagen o video*.', m)
    }
    await m.react('🕓')

    // Convertimos a WebP
    const webpBuffer = await toWebp(buffer)
const userName = m.pushName || m.sender.split('@')[0]
    // Añadir nombre y autor al sticker
    const sticker = new Sticker(webpBuffer, {
      pack: '✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰',
      author: `@${userName}`,
      type: 'full'
    })

    const finalSticker = await sticker.toBuffer()

    await conn.sendFile(m.chat, finalSticker, 'sticker.webp', '', m)
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('✖️')
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']
handler.group = true 

export default handler

async function toWebp(buffer) {
  const { ext } = await fromBuffer(buffer)
  if (!/(png|jpg|jpeg|mp4|mkv|m4p|gif|webp)/i.test(ext)) throw 'Media no compatible.'

  const input = path.join(global.tempDir || './tmp', `${Date.now()}.${ext}`)
  const output = path.join(global.tempDir || './tmp', `${Date.now()}.webp`)
  fs.writeFileSync(input, buffer)

  let options = [
    '-vcodec', 'libwebp',
    '-loop', '0', '-preset', 'default', '-an', '-vsync', '0',
    '-vf', "scale=512:512:flags=lanczos"
  ]

  return new Promise((resolve, reject) => {
    fluent(input)
      .addOutputOptions(options)
      .toFormat('webp')
      .save(output)
      .on('end', () => {
        const result = fs.readFileSync(output)
        fs.unlinkSync(input)
        fs.unlinkSync(output)
        resolve(result)
      })
      .on('error', (err) => {
        fs.unlinkSync(input)
        reject(err)
      })
  })
}

function isUrl(text) {
  return text.match(
    new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi')
  )
        }
*/
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import fluent from 'fluent-ffmpeg'
import { Sticker } from 'wa-sticker-formatter'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'

let handler = async (m, { conn, args }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  let buffer

  try {
    // Si responde a un sticker
    if (/webp/.test(mime) && q.download) {
      buffer = await q.download()

      await m.react('🕓')

      return await conn.sendFile(
        m.chat,
        buffer,
        'sticker.webp',
        '',
        m
      )
    }

    // Imagen o video
    if (/image|video/g.test(mime) && q.download) {
      if (/video/.test(mime) && (q.msg || q).seconds > 11)
        return conn.reply(
          m.chat,
          '[ ✰ ] El video no puede durar más de *10 segundos*',
          m
        )

      buffer = await q.download()
    }

    // URL
    else if (args[0] && isUrl(args[0])) {
      const res = await fetch(args[0])
      buffer = await res.buffer()
    }

    else {
      return conn.reply(
        m.chat,
        '[ ✰ ] Responde a una *imagen, video o sticker*.',
        m
      )
    }

    await m.react('🕓')

    const webpBuffer = await toWebp(buffer)

    const userName = m.pushName || m.sender.split('@')[0]

    const sticker = new Sticker(webpBuffer, {
      pack: '✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰',
      author: `@${userName}`,
      type: 'full'
    })

    const finalSticker = await sticker.toBuffer()

    await conn.sendFile(
      m.chat,
      finalSticker,
      'sticker.webp',
      '',
      m
    )

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('✖️')
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']
handler.group = true

export default handler

async function toWebp(buffer) {
  const { ext } = await fromBuffer(buffer)

  if (!/(png|jpg|jpeg|mp4|mkv|m4p|gif|webp)/i.test(ext))
    throw 'Media no compatible.'

  const input = path.join(
    global.tempDir || './tmp',
    `${Date.now()}.${ext}`
  )

  const output = path.join(
    global.tempDir || './tmp',
    `${Date.now()}.webp`
  )

  fs.writeFileSync(input, buffer)

  const options = [
    '-vcodec', 'libwebp',
    '-loop', '0',
    '-preset', 'default',
    '-an',
    '-vsync', '0',
    '-vf', 'scale=512:512:flags=lanczos'
  ]

  return new Promise((resolve, reject) => {
    fluent(input)
      .addOutputOptions(options)
      .toFormat('webp')
      .save(output)
      .on('end', () => {
        const result = fs.readFileSync(output)

        fs.unlinkSync(input)
        fs.unlinkSync(output)

        resolve(result)
      })
      .on('error', (err) => {
        if (fs.existsSync(input))
          fs.unlinkSync(input)

        reject(err)
      })
  })
}

function isUrl(text) {
  return /^https?:\/\/.+/i.test(text)
}
