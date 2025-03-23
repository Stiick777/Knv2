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

import { exec } from 'child_process'
import fs from 'fs'

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''

        if (!/image|video/g.test(mime)) {
            return conn.reply(m.chat, '⚠️ *_Envía una imagen o video para convertir en sticker._*', m)
        }

        let media = await q.download()
        if (!media) return conn.reply(m.chat, '⚠️ *_No se pudo descargar el archivo._*', m)

        let inputPath = `../tmp/input.${mime.includes('video') ? 'mp4' : 'jpg'}`
        let outputPath = `../tmp/sticker.webp`

        fs.writeFileSync(inputPath, media)

        // **Comando para convertir a sticker**
        let command = mime.includes('video')
            ? `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -q:v 50 -preset default -loop 0 -an -vsync 0 -s 512:512 ${outputPath}`
            : `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -q:v 50 ${outputPath}`

        exec(command, async (err) => {
            if (err) {
                console.error(err)
                return conn.reply(m.chat, '⚠️ *_Error al convertir la imagen/video a sticker._*', m)
            }

            await conn.sendFile(m.chat, outputPath, 'sticker.webp', '', m, true)
            fs.unlinkSync(inputPath)
            fs.unlinkSync(outputPath)
        })
    } catch (e) {
        console.error(e)
        conn.reply(m.chat, '⚠️ *_Ocurrió un error inesperado._*', m)
    }
}

handler.help = ['s']
handler.tags = ['sticker']
handler.command = ['s', 'sticker']

export default handler
