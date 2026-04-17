const handler = async (m, { conn, text, participants, args, usedPrefix }) => {

  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  // 🔹 Normalizar sender
  const sender = conn.decodeJid(m.sender)

  // 🔹 Owners
  const ownerNumbers = global.owner.map(v => v.replace(/[^0-9]/g, ""))
  const ownerIds = ownerNumbers.map(num => num + "@s.whatsapp.net")
  const isOwner = ownerIds.includes(sender) || m.fromMe

  // 🔹 Admin
  const userData = participants.find(u => conn.decodeJid(u.id) === sender)
  const isAdmin = userData?.admin === "admin" || userData?.admin === "superadmin"

  // 🔥 Permiso combinado
  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, `❌ Solo admins o owner pueden usar este comando.`, m)
  }

  const pesan = args.join(' ') || '*Sin mensaje*'
  const colombia = `💌 *Mensaje:* ${pesan}`

  let teks = `💥 *INVOCANDO GRUPO*\n${colombia}\n\n☁️ *Tags:*\n`

  // 🔹 Usuarios normalizados
  let users = participants.map(u => conn.decodeJid(u.id))

  for (const jid of users) {
    teks += `@${jid.split('@')[0]}\n`
  }

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: users
  })
}

handler.help = ['tagall *<mensaje>*', 'invocar *<mensaje>*']
handler.tags = ['grupo']
handler.command = ['tagall', 'invocar']
handler.admin = false // 🔥 importante
handler.group = true

export default handler
