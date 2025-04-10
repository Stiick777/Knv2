let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('Por favor proporciona el ID del grupo.\nEjemplo: .banchat 1203630xxxxx@g.us')

  let chatId = args[0]

  // Verifica si el grupo existe en la base de datos
  if (!global.db.data.chats[chatId]) {
    global.db.data.chats[chatId] = {} // crea el objeto si no existe
  }

  global.db.data.chats[chatId].isBanned = true
  conn.reply(m.chat, `✅ *KanBot ha sido desactivado en el grupo con ID:* ${chatId}`, m)
}

handler.help = ['bcht <ID>']
handler.tags = ['owner']
handler.command = ['bcht']
handler.rowner = true

export default handler