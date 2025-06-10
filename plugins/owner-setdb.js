import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    if (!m.quoted || m.quoted.mtype !== 'documentMessage') {
      return m.reply('❗ Debes responder a un archivo `.json` enviado como documento.')
    }

    const mime = m.quoted.mimetype || ''
    if (!mime.includes('json')) {
      return m.reply('⚠️ El archivo debe tener formato `.json`.')
    }

    const stream = await downloadContentFromMessage(m.quoted.message.documentMessage || m.quoted, 'document')
    let buffer = Buffer.from([])

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }

    const path = './database.json' // Puedes cambiarlo a donde uses tu DB real
    fs.writeFileSync(path, buffer)

    m.reply('✅ Base de datos actualizada con éxito desde el archivo JSON.')
  } catch (err) {
    console.error(err)
    m.reply(`❌ Error al cargar el archivo: ${err}`)
  }
}

handler.help = ['setdb']
handler.tags = ['owner']
handler.command = /^setdb$/i
handler.rowner = true

export default handler
