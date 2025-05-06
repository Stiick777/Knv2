// handler/antiOwnerTag.js
const handler = async (m, { conn }) => {
  if (!m.isGroup) return

  // Obtener solo los números de los owners
  const ownerNumbers = global.owner.map(o => o[0])

  // Verificar si se mencionó a un owner usando el menú de menciones
  const mencionReal = m.mentionedJid?.some(jid =>
    ownerNumbers.some(num => jid.includes(num))
  )

  // Verificar si se mencionó manualmente con @numero
  const mencionesManual = ownerNumbers.some(num =>
    m.text?.includes('@' + num)
  )

  // Si se detecta una mención real o manual, enviar advertencia
  if (mencionReal || mencionesManual) {
    await conn.reply(m.chat, 'Por favor no etiquete al owner si no es para algo estrictamente necesario.', m)
  }
}

export default handler

handler.group = true
