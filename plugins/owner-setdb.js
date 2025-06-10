import fs from 'fs'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    try {
        // Extraer el documento (ya sea directo o citado)
        const document = m.msg?.documentMessage ||
                         m.quoted?.message?.documentMessage || // caso respondido
                         m.quoted?.msg?.documentMessage       // fallback opcional

        if (!document) {
            throw '⚠️ Por favor responde o etiqueta un documento JSON con el comando *setdb*.'
        }

        await m.react('🕓')

        const mime = document.mimetype || ''
        const filename = document.fileName || 'database.json'

        if (!mime.includes('json')) {
            throw '❌ El archivo debe ser de tipo *JSON*.'
        }

        const stream = await downloadContentFromMessage(document, 'document')
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
