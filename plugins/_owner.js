const handler = async (m, { conn }) => {
  if (!m.isGroup || !m.text) return

  // Extraer solo los números de teléfono del array global.owner
  const ownerNums = global.owner.map(o => o[0])
  const ownerJids = ownerNums.map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net')

  // Detectar menciones reales (cuando se usa el @usuario directamente)
  const mentioned = m.mentionedJid || m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
  const mencionReal = mentioned.some(jid => ownerJids.includes(jid))

  // Detectar menciones manuales por texto (@123456789)
  const mencionesManual = ownerNums.some(num => m.text.includes('@' + num))

  if (mencionReal || mencionesManual) {
    await conn.reply(m.chat, 'No etiquetes al owner si no es algo importante.', m)

    // Opcional: enviar alerta privada a cada owner
    for (const jid of ownerJids) {
      await conn.sendMessage(jid, {
        text: `*Alerta:* Te mencionaron en el grupo:\n${m.chat}\nPor: @${m.sender.split('@')[0]}`,
        mentions: [m.sender]
      })
    }

    console.log('[antiOwnerTag] Mención al owner detectada.')
  }
}

export default handler

handler.group = true
handler.all = true
