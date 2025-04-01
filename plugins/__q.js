import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import fluent from 'fluent-ffmpeg'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'
import { exec } from 'child_process'

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

    const stickerBuffer = await toWebp(buffer, {
      packname: global.packname || 'Sticker Bot',
      author: global.author || 'By Nexus-Bot'
    })

    await conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m)
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('✖️')
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['mn', 'sticker', 'stiker']
handler.group = true

export default handler

async function toWebp(buffer, { packname, author }) {
  const { ext } = await fromBuffer(buffer)
  if (!/(png|jpg|jpeg|mp4|gif|webp)/i.test(ext)) throw 'Media no compatible.'

  const input = path.join(global.tempDir || './tmp', `${Date.now()}.${ext}`)
  const output = path.join(global.tempDir || './tmp', `${Date.now()}.webp`)
  const exifPath = path.join(global.tempDir || './tmp', `${Date.now()}_exif.exif`)

  fs.writeFileSync(input, buffer)

  return new Promise((resolve, reject) => {
    fluent(input)
      .addOutputOptions([
        '-vcodec', 'libwebp',
        '-loop', '0', '-preset', 'default', '-an', '-vsync', '0',
        '-vf', "scale='if(gt(iw,ih),-1,512):if(gt(iw,ih),512,-1)',format=rgba"
      ])
      .toFormat('webp')
      .save(output)
      .on('end', async () => {
        try {
          await createExif({ packname, author }, exifPath)
          const finalOutput = path.join(global.tempDir || './tmp', `${Date.now()}_final.webp`)
          exec(`webpmux -set exif ${exifPath} ${output} -o ${finalOutput}`, (err) => {
            fs.unlinkSync(input)
            fs.unlinkSync(output)
            fs.unlinkSync(exifPath)
            if (err) return reject(err)
            resolve(fs.readFileSync(finalOutput))
          })
        } catch (err) {
          reject(err)
        }
      })
      .on('error', (err) => {
        fs.unlinkSync(input)
        reject(err)
      })
  })
}

async function createExif({ packname, author }, exifPath) {
  const jsonExif = {
    "sticker-pack-id": "com.nexusbot.stickers",
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
    "emojis": ["🔥", "😎", "🤖"]
  }

  const exifData = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
  const jsonBuffer = Buffer.from(JSON.stringify(jsonExif), 'utf-8')
  fs.writeFileSync(exifPath, Buffer.concat([exifData, jsonBuffer]))
}

function isUrl(text) {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}