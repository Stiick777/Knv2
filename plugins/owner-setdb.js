import fs from 'fs'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    try {
        // Obtener el mensaje con el documento (ya sea el actual o uno citado)
        const documentMessage = m.msg?.documentMessage || m.quoted?.msg?.documentMessage

        if (!documentMessage) {
            throw '⚠️ Por favor responde o etiqueta un documento JSON con el comando *setdb*.'
        }

        await m.react('🕓')

        const mime = documentMessage.mimetype || ''
        const filename = documentMessage.fileName || 'database.json'

        if (!mime.includes('json')) {
            throw '❌ El archivo debe ser de tipo *JSON*.'
        }

        const stream = await downloadContentFromMessage(documentMessage, 'document')
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
