var handler = async (m, { conn }) => {

  const group = m.chat

  try {
    // 🔹 Metadata del grupo
    const groupInfo = await conn.groupMetadata(group)
    const participants = groupInfo.participants

    const botJid = conn.decodeJid(conn.user.id)
    const botData = participants.find(u => conn.decodeJid(u.id) === botJid)

    const isBotAdmin = botData?.admin

    // 🔥 Validar admin del bot
    if (!isBotAdmin) {
      return conn.reply(m.chat, `❌ El bot debe ser admin para obtener el enlace del grupo.`, m)
    }

    // 🔹 Foto del grupo
    const pp = await conn.profilePictureUrl(group, 'image')
      .catch(() => 'https://files.catbox.moe/xr2m6u.jpg')

    // 🔹 Link
    const code = await conn.groupInviteCode(group)
    const link = `https://chat.whatsapp.com/${code}`

    let message = `\t*⌁☍꒷₊˚ Link del Grupo ꒷₊˚⌁☍*\n\n> \`Link:\` ${link}`

    await conn.sendMessage(group, {
      image: { url: pp },
      caption: message
    })

  } catch (e) {
    conn.reply(m.chat, `⚠️ Error al obtener el link:\n${e.message}`, m)
  }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = false // 🔥 lo manejamos manual

export default handler
