var handler = async (m, { conn, usedPrefix, command }) => {

  // 🔹 Normalizar sender
  const sender = conn.decodeJid(m.sender)

  // 🔹 Obtener usuario objetivo (mention o reply)
  let mentionedJid = m.mentionedJid || []
  let target = mentionedJid[0] 
    ? conn.decodeJid(mentionedJid[0]) 
    : m.quoted 
      ? conn.decodeJid(m.quoted.sender) 
      : null

  if (!target) {
    return conn.reply(m.chat, `❀ Debes mencionar o responder a un usuario para expulsarlo.`, m)
  }

  // 🔹 Owners
  const ownerNumbers = global.owner.map(v => v.replace(/[^0-9]/g, ""))
  const ownerIds = ownerNumbers.map(num => num + "@s.whatsapp.net")
  const isOwner = ownerIds.includes(sender) || m.fromMe

  try {
    const groupInfo = await conn.groupMetadata(m.chat)
    const participants = groupInfo.participants

    // 🔹 Admins
    const userData = participants.find(u => conn.decodeJid(u.id) === sender)
    const botData = participants.find(u => conn.decodeJid(u.id) === conn.decodeJid(conn.user.id))

    const isAdmin = userData?.admin === "admin" || userData?.admin === "superadmin"
    const isBotAdmin = botData?.admin

    // 🔥 Permisos
    if (!isAdmin && !isOwner) {
      return conn.reply(m.chat, `❌ Debes ser admin o owner para usar este comando.`, m)
    }

    if (!isBotAdmin) {
      return conn.reply(m.chat, `❌ El bot necesita ser admin para expulsar usuarios.`, m)
    }

    // 🔴 Protecciones
    const ownerGroup = conn.decodeJid(groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net')

    if (target === conn.decodeJid(conn.user.id)) {
      return conn.reply(m.chat, `ꕥ No puedo eliminar el bot del grupo.`, m)
    }

    if (target === ownerGroup) {
      return conn.reply(m.chat, `ꕥ No puedo eliminar al propietario del grupo.`, m)
    }

    if (ownerIds.includes(target)) {
      return conn.reply(m.chat, `ꕥ No puedo eliminar al propietario del bot.`, m)
    }

    // 🔹 Ejecutar kick
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove')

    await conn.reply(m.chat, `✅ Usuario eliminado correctamente.`, m)
    await m.react('✅')

  } catch (e) {
    conn.reply(m.chat, `⚠︎ Error:\n${e.message}`, m)
  }
}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick', 'kc', 'hechar', 'sacar', 'ban']
handler.group = true
handler.admin = false // 🔥 importante
handler.botAdmin = false // lo controlamos manual

export default handler
