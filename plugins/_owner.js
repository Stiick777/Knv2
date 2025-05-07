// handler/antiOwnerTag.js
const handler = async (m, { conn }) => {
  if (!m.isGroup || !m.text) return

  // Obtener JIDs de owners en formato completo
  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')
  const ownerNums = global.owner.map(o => o[0])

  // Mostrar datos para depurar
  console.log('[antiOwnerTag] Texto:', m.text)
  console.log('[antiOwnerTag] mentionedJid:', m.mentionedJid)
  console.log('[antiOwnerTag] Owners JIDs:', ownerJids)

  // Detectar mención real por menu
  const mencionReal = (m.mentionedJid || []).some(jid => ownerJids.includes(jid))

  // Detectar mención manual por texto
  const mencionesManual = ownerNums.some(num => m.text.includes('@' + num))

  if (mencionReal || mencionesManual) {
    await conn.reply(m.chat, 'Por favor no etiquete al owner si no es para algo estrictamente necesario.', m)
    console.log('[antiOwnerTag] Mención al owner detectada.')
  }
}

export default handler

handler.group = true
