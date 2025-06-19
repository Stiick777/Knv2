var handler = async (m, { conn, command }) => {
  const setting = (command === 'abrir' || command === 'open') ? 'not_announcement'
                : (command === 'cerrar' || command === 'close') ? 'announcement'
                : null

  if (!setting) {
    return conn.reply(m.chat, `*Elija una opción válida para configurar el grupo*\n\nEjemplo:\n○ *!abrir*\n○ *!cerrar*\n○ *!open*\n○ *!close*`, m)
  }

  await conn.groupSettingUpdate(m.chat, setting)

  // Mensaje personalizado según acción
  const estado = (setting === 'not_announcement') 
    ? (command === 'abrir' ? 'abierto' : 'opened') 
    : (command === 'cerrar' ? 'cerrado' : 'closed')

  await conn.reply(m.chat, `✅ *Grupo ${estado} correctamente*`, m)
  await m.react(done)
}

handler.help = ['abrir', 'cerrar', 'open', 'close']
handler.tags = ['grupo']
handler.command = ['abrir', 'cerrar', 'open', 'close']
handler.admin = true
handler.botAdmin = true

export default handler
