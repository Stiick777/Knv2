// handler/antiOwnerTag.js
const handler = async (m, { conn }) => {
  if (!m.isGroup || !m.mentionedJid || m.mentionedJid.length === 0) return

  // Obtener los JIDs de los owners
  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')

  // Verificar si algún owner fue mencionado
  const mencionoAlOwner = m.mentionedJid.some(jid => ownerJids.includes(jid))

  if (mencionoAlOwner) {
    await conn.reply(m.chat, 'Por favor no etiquete al owner si no es para algo estrictamente necesario.', m)
  }
}

export default handler

handler.group = true
