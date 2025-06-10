import fs from 'fs'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  try {
    await m.react('🕓')

    // Verifica si se responde a un mensaje
    const quoted = m.quoted?.message?.documentMessage
    if (!quoted) throw '⚠️ Por favor responde o etiqueta un documento JSON con el comando *setdb*.'

    const mime = quoted.mimetype || ''
    const filename = quoted.fileName || 'database.json'

    // Asegurarse que sea un archivo JSON
    if (!mime.includes('json')) {
      throw '❌ El archivo debe ser un documento de tipo JSON.'
    }

    // Descarga el contenido del archivo
    const stream = await downloadContentFromMessage(quoted, 'document')
    let buffer = Buffer.from([])

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }

    // Guarda el archivo
    fs.writeFileSync('./src/database/database.json', buffer)

    await m.react('✅')
    await m.reply(`✅ Archivo *${filename}* guardado correctamente.`)

  } catch (err) {
    console.error(err)
    await m.react('❌')
    await m.reply(`❌ No fue posible guardar el archivo.\n🧾 Razón: ${err.message || err}`)
  }
}

handler.help = ['setdb']
handler.tags = ['owner']
handler.command = /^setdb$/i
handler.rowner = true

export default handler
