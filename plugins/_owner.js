const handler = async (m, { conn }) => {
  // Obtener JIDs completos de los owners
  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')

  // Extraer menciones desde extendedTextMessage
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []

  // Comparar con los JIDs de los owners
  const mencionAlOwner = mentioned.some(jid => ownerJids.includes(jid))

  if (mencionAlOwner) {
    await conn.reply(m.chat, '¡No etiquetes al owner sin necesidad!', m)
    console.log('[antiOwnerTag] Mencionaron al owner:', mentioned)
  } else {
    await conn.reply(m.chat, 'No se mencionó a ningún owner.', m)
  }
}

export default handler

handler.command = ['alerta'] // Usa !alerta @owner para probar
handler.group = true
