import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn }) => {
    let stiker = false
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''

        if (/webp|image|video/g.test(mime)) {
            if (/video/g.test(mime) && (q.msg || q).seconds > 8) 
                return m.reply(`☁️ *¡El video no puede durar más de 8 segundos!*`)

            let img = await q.download?.()
            if (!img) 
                return conn.reply(m.chat, `⚠️ *_La conversión ha fallado, intenta enviar primero imagen/video/gif y luego responde con el comando._*`, m)

            await m.reply('✨ *Creando sticker... Por favor, espere un momento.*')
            
            try {
                stiker = await sticker(img, false, global.packsticker, global.author)
            } catch (e) {
                console.error(e)
            }
        } else {
            return conn.reply(m.chat, '⚠️ *_La conversión ha fallado, intenta enviar primero imagen/video/gif y luego responde con el comando._*', m)
        }
    } catch (e) {
        console.error(e)
        if (!stiker) stiker = e
    } finally {
        if (stiker) {
            conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, { 
                contextInfo: { 
                    'forwardingScore': 200, 
                    'isForwarded': false, 
                    externalAdReply: { 
                        showAdAttribution: false, 
                        title: packname, 
                        body: `by Stiiven`, 
                        mediaType: 2, 
                        sourceUrl: redes 
                    } 
                } 
            })
        } else {
            return conn.reply(m.chat, '⚠️ *_La conversión ha fallado, intenta enviar primero imagen/video/gif y luego responde con el comando._*', m)
        }
    }
}

handler.help = ['stiker <img>']
handler.tags = ['sticker']
handler.group = true
handler.command = ['s', 'sticker', 'stiker']

export default handler