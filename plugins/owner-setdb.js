import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    // Asegurarse de que se está citando un mensaje
    if (!m.quoted || m.quoted.mtype !== 'documentMessage') {
      return m.reply('❗ Debes responder a un archivo `.json` enviado como documento.')
    }

    const mime = m.quoted.mimetype || ''
    if (!mime.includes('json')) {
      return m.reply('⚠️ El archivo debe tener formato `.json`.')
    }

    // Corregido: Usamos directamente m.quoted
    const stream = await downloadContentFromMessage(m.quoted, 'document')

    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }

    // Intentamos verificar si es JSON válido
    try {
      JSON.parse(buffer.toString()) // Lanza error si no es JSON válido
    } catch (e) {
      return m.reply('⚠️ El archivo no contiene un JSON válido.')
    }

    fs.writeFileSync('./database.json', buffer)

    m.reply('✅ Base de datos actualizada con éxito desde el archivo JSON.')
  } catch (err) {
    console.error(err)
    m.reply(`❌ Error al cargar el archivo:\n${err}`)
  }
}

handler.help = ['setdb']
handler.tags = ['owner']
handler.command = /^setdb$/i
handler.rowner = true

export default handler
