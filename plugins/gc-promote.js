/*var handler = async (m, { conn,usedPrefix, command, text }) => {

if (isNaN(text) && !text.match(/@/g)){

} else if (isNaN(text)) {
var number = text.split`@`[1]
} else if (!isNaN(text)) {
var number = text
}

if (!text && !m.quoted) return conn.reply(m.chat, `🚩 *Responda a un participante del grupo para asignarle admin.*`, m, rcanal)
if (number.length > 13 || (number.length < 11 && number.length > 0)) return conn.reply(m.chat, `✨️ *Debe de responder o mensionar a una persona para usar este comando.*`, m, fake)

try {
if (text) {
var user = number + '@s.whatsapp.net'
} else if (m.quoted.sender) {
var user = m.quoted.sender
} else if (m.mentionedJid) {
var user = number + '@s.whatsapp.net'
} 
} catch (e) {
} finally {
conn.groupParticipantsUpdate(m.chat, [user], 'promote')
conn.reply(m.chat, `✅ *Fue agregado como admin del grupo con exito.*`, m, fake)
}

}
handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote','darpija', 'promover']

handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler
*/
var handler = async (m, { conn, usedPrefix, command, text }) => {

  // ✅ Función para normalizar cualquier JID a @s.whatsapp.net
  function normalizeJid(jid = '') {
    return jid.replace(/@.+/, '@s.whatsapp.net')
  }

  let number = ''
  if (isNaN(text) && !text?.includes('@')) {
    // texto inválido
  } else if (isNaN(text)) {
    number = text.split('@')[1]
  } else if (!isNaN(text)) {
    number = text
  }

  if ((!text && !m.quoted) || (number.length > 13 || (number.length < 11 && number.length > 0))) {
    return conn.reply(m.chat, `⚠️ Debes mencionar a un usuario válido para promoverlo.`, m)
  }

  try {
    let user = ''
    if (text) {
      user = normalizeJid(number)
    } else if (m.quoted?.sender) {
      user = normalizeJid(m.quoted.sender)
    } else if (m.mentionedJid?.[0]) {
      user = normalizeJid(m.mentionedJid[0])
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
    conn.reply(m.chat, `✅ El usuario ha sido promovido a administrador.`, m)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Ocurrió un error al promover al usuario.`, m)
  }
}

handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote','darpija', 'promover']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler
