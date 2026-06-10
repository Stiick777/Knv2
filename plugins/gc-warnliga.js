import { version as baileysVersion } from '@whiskeysockets/baileys/package.json'

let handler = async (m, { conn }) => {
  const version = Array.isArray(conn?.ws?.version)
    ? conn.ws.version.join('.')
    : baileysVersion

  let mensaje = `
╭━━━〔 BAILEYS INFO 〕━━━⬣
┃ 📦 Versión: ${version}
┃ 🤖 Bot: ${conn.user?.name || 'Desconocido'}
┃ 🆔 JID: ${conn.user?.jid || conn.user?.id}
╰━━━━━━━━━━━━━━━━⬣
`

  await conn.reply(m.chat, mensaje, m)
}

handler.command = ['baileys', 'version']
handler.owner = true

export default handler
