// handler/antiOwnerTag.js
const handler = async (m, { conn }) => {
  if (!m.isGroup || !m.text) return

  // Convertir números de owner a JIDs completos
  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')

  // Menciones reales desde el mensaje
  const realMentions = [
    ...(m.mentionedJid || []),
    ...(m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])
  ]

  // Verificar si mencionó a algún owner
  const mencionReal = realMentions.some(jid => ownerJids.includes(jid))

  // También detectar mención manual como texto (ej. "@573...")
  const mencionesManual = global.owner.some(o =>
    m.text.includes('@' + o[0])
  )

  if (mencionReal || mencionesManual) {
    await conn.reply(m.chat, 'Por favor no etiquete al owner si no es para algo estrictamente necesario.', m)
  }
}

export default handler

handler.group = true
