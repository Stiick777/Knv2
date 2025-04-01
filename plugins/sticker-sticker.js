/*import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''

        if (!/webp|image|video/g.test(mime)) {
            return conn.reply(m.chat, '⚠️ *_Debes responder con una imagen, video o GIF._*', m)
        }

        if (/video/g.test(mime) && (q.msg || q).seconds > 8) {
            return m.reply('☁️ *¡El video no puede durar más de 8 segundos!*')
        }

        let img = await q.download?.()
        if (!img) {
            return conn.reply(m.chat, '⚠️ *_La conversión ha fallado, intenta enviar primero imagen/video/gif y luego responde con el comando._*', m)
        }

        await m.reply('✨ *Creando sticker... Por favor, espere un momento.*')

        let stiker = await sticker(img, false, global.packsticker, global.author).catch(e => {
            console.error(e)
            return null
        })

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, { 
                
            })
        } else {
            conn.reply(m.chat, '⚠️ *_No se pudo crear el sticker. Intenta nuevamente._*', m)
        }
    } catch (e) {
        console.error(e)
        conn.reply(m.chat, '⚠️ *_Ocurrió un error inesperado. Intenta nuevamente._*', m)
    }
}

handler.help = ['sticker <img>']
handler.tags = ['sticker']
handler.group = true
handler.command = ['s', 'sticker', 'stiker']

export default handler
*/
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import fluent from 'fluent-ffmpeg'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'

let handler = async (m, { conn, args }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  let buffer

  try {
    if (/image|video/g.test(mime) && q.download) {
      if (/video/.test(mime) && (q.msg || q).seconds > 11)
        return conn.reply(m.chat, '[ ✰ ] El video no puede durar más de *10 segundos*', m, rcanal)
      buffer = await q.download()
    } else if (args[0] && isUrl(args[0])) {
      const res = await fetch(args[0])
      buffer = await res.buffer()
    } else {
      return conn.reply(m.chat,'[ ✰ ] Responde a una *imagen o video*.', m, rcanal)
    }
    await m.react('🕓')

   const stickers = await toWebp(buffer, { 
  name: global.packname, 
  author: global.author 
});
    
    await conn.sendFile(m.chat, stickers, 'sticker.webp', '', m)
    await m.react('✅')
  } catch (e) {
    await m.react('✖️')
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']
handler.group = true 

export default handler

async function toWebp(buffer, opts = {}) {    
  const { ext } = await fromBuffer(buffer);    
  if (!/(png|jpg|jpeg|mp4|mkv|m4p|gif|webp)/i.test(ext)) throw 'Media no compatible.';    

  const input = path.join(global.tempDir || './tmp', `${Date.now()}.${ext}`);    
  const output = path.join(global.tempDir || './tmp', `${Date.now()}.webp`);    
  fs.writeFileSync(input, buffer);    

  let aspectRatio = `scale='if(gt(iw,ih),-1,299):if(gt(iw,ih),299,-1)', crop=299:299:exact=1`;    

  let options = [    
    '-vcodec', 'libwebp',    
    '-vf', `${aspectRatio}, fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,    
    '-loop', '0', '-preset', 'default', '-an', '-vsync', '0',
    '-metadata', `title=${global.packname}`,
    '-metadata', `author=${global.author}`
  ];    

  return new Promise((resolve, reject) => {    
    fluent(input)    
      .addOutputOptions(options)    
      .toFormat('webp')    
      .save(output)    
      .on('end', () => {    
        const result = fs.readFileSync(output);    
        fs.unlinkSync(input);    
        fs.unlinkSync(output);    
        resolve(result);    
      })    
      .on('error', (err) => {    
        fs.unlinkSync(input);    
        reject(err);    
      });    
  });    
}

function isUrl(text) {
  return text.match(
    new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi')
  )
                                 }

