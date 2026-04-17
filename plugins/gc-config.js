var handler = async (m, { conn, command }) => {

  const setting = (command === 'abrir' || command === 'open') ? 'not_announcement'
                : (command === 'cerrar' || command === 'close') ? 'announcement'
                : null

  if (!setting) {
    return conn.reply(m.chat, `*Elija una opción válida para configurar el grupo*\n\nEjemplo:\n○ *!abrir*\n○ *!cerrar*\n○ *!open*\n○ *!close*`, m)
  }

  // 🔹 Normalizar sender (soporta LID, :xx, etc)
  const sender = conn.decodeJid(m.sender)

  // 🔹 Owners normalizados
  const ownerNumbers = global.owner.map(v => v.replace(/[^0-9]/g, ""))
  const ownerIds = ownerNumbers.map(num => num + "@s.whatsapp.net")

  const isOwner = ownerIds.includes(sender) || m.fromMe

  // 🔹 Admin del grupo
  const groupMetadata = await conn.groupMetadata(m.chat)
  const participants = groupMetadata.participants

  const user = participants.find(u => conn.decodeJid(u.id) === sender)
  const bot = participants.find(u => conn.decodeJid(u.id) === conn.decodeJid(conn.user.id))

  const isAdmin = user?.admin === "admin" || user?.admin === "superadmin"
  const isBotAdmin = bot?.admin

  // 🔥 Permisos combinados
  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, `❌ *Debes ser admin o owner para usar este comando*`, m)
  }

  if (!isBotAdmin) {
    return conn.reply(m.chat, `❌ *El bot necesita ser admin para ejecutar esto*`, m)
  }

  // 🔹 Ejecutar cambio
  await conn.groupSettingUpdate(m.chat, setting)

  const estado = (setting === 'not_announcement') 
    ? (command === 'abrir' ? 'abierto' : 'opened') 
    : (command === 'cerrar' ? 'cerrado' : 'closed')

  await conn.reply(m.chat, `✅ *Grupo ${estado} correctamente*`, m)
  await m.react('✅')
}

handler.help = ['abrir', 'cerrar', 'open', 'close']
handler.tags = ['grupo']
handler.command = ['abrir', 'cerrar', 'open', 'close']
handler.botAdmin = false // lo manejamos manualmente

export default handler
