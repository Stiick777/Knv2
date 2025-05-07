const handler = async (m, { conn }) => {
  if (!m.isGroup || !m.text) return

  // Verifica que global.owner esté definido correctamente
  if (!global.owner || !Array.isArray(global.owner)) return

  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')
  const ownerNums = global.owner.map(o => o[0])

  // Extraer las menciones reales del mensaje
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || m.mentionedJid || []

  const mencionReal = mentioned.some(jid => ownerJids.includes(jid))
  const mencionesManual = ownerNums.some(num => m.text.includes('@' + num))

  if (mencionReal || mencionesManual) {
    await conn.reply(m.chat, 'Por favor no etiquete al owner si no es estrictamente necesario.', m)
    console.log('[antiOwnerTag] Mención al owner detectada.')
  }
}

export default handler

handler.group = true
handler.all = true
