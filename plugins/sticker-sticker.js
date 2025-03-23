import { sticker } from '../lib/sticker.js'

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

