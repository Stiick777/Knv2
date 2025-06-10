import fs from 'fs'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    try {
        if (!m.msg || !m.msg.documentMessage) {
            throw '⚠️ Por favor responde a un documento JSON con el comando *setdb*.'
        }

        await m.react('🕓')

        const mime = m.msg.documentMessage.mimetype || ''
        const filename = m.msg.documentMessage.fileName || 'database.json'

        if (!mime.includes('json')) {
            throw '❌ El archivo debe ser de tipo *JSON*.'
        }

        const stream = await downloadContentFromMessage(m.msg.documentMessage, 'document')
        let buffer = Buffer.from([])

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        fs.writeFileSync('./src/database/database.json', buffer)

        await m.react('✅')
        await m.reply(`✅ El archivo *${filename}* se ha guardado correctamente.`)
    } catch (err) {
        console.error('[Error al guardar el archivo]:', err)
        await m.react('❌')
        await m.reply(`❌ No fue posible guardar el archivo.\n🧾 Razón: ${err.message || err}`)
    }
}

handler.help = ['setdb']
handler.tags = ['owner']
handler.command = /^(setdb)$/i
handler.rowner = true

export default handler