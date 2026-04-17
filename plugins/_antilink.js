let linkRegex = /https?:\/\/(?:chat\.whatsapp\.com\/[A-Za-z0-9]+(?:\?[^\s]*)?|whatsapp\.com\/channel\/[A-Za-z0-9]+(?:\?[^\s]*)?)/i;

let allowedLinks = [
  "https://chat.whatsapp.com/HDoyT3SlpYzBlpawlWNpKw?mode=ems_copy_c",
  "https://whatsapp.com/channel/0029VakhAHc5fM5hgaQ8ed2N"
];

export async function before(m, { conn }) {

  if (m.isBaileys && m.fromMe) return true;
  if (!m.isGroup) return false;

  let chat = global.db.data.chats[m.chat];
  if (!chat?.antiLink) return true;

  const text = m.text || "";
  if (!linkRegex.test(text)) return true;

  // 🔹 Normalizar sender
  const sender = conn.decodeJid(m.sender)

  // 🔹 Owners
  const ownerNumbers = global.owner.map(v => v.replace(/[^0-9]/g, ""))
  const ownerIds = ownerNumbers.map(num => num + "@s.whatsapp.net")
  const isOwner = ownerIds.includes(sender) || m.fromMe

  // 🔹 Metadata
  const groupMetadata = await conn.groupMetadata(m.chat)
  const participants = groupMetadata.participants

  const userData = participants.find(u => conn.decodeJid(u.id) === sender)
  const botData = participants.find(u => conn.decodeJid(u.id) === conn.decodeJid(conn.user.id))

  const isAdmin = userData?.admin === "admin" || userData?.admin === "superadmin"
  const isBotAdmin = botData?.admin

  // 🔥 Ignorar
  if (allowedLinks.some(link => text.includes(link))) return true
  if (isAdmin || isOwner) return true

  // 🔥 Verificar bot admin
  if (!isBotAdmin) {
    return conn.reply(m.chat, `⚡ *No soy admin, no puedo eliminar enlaces*`, m)
  }

  // 🔹 Evitar link del propio grupo
  const thisGroupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
  if (text.includes(thisGroupLink)) return true

  try {
    // 🔹 Eliminar mensaje
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.key.participant
      }
    })

    // 🔴 Protección extra (no expulsar owner)
    if (ownerIds.includes(sender)) return true

    // 🔹 Expulsar usuario
    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')

    await conn.sendMessage(m.chat, {
      text: `🚫 Se eliminó a @${sender.split('@')[0]} por enviar un enlace prohibido.`,
      mentions: [sender]
    })

  } catch (e) {
    console.log(e)
  }

  return true
}
