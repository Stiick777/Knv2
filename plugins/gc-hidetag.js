import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

// 🔄 Normalizar correctamente
function normalizeJid(conn, jid = '') {
  return conn.decodeJid(jid)
}

var handler = async (m, { conn, text, participants }) => {

  if (!m.quoted && !text)
    return conn.reply(m.chat, `❀ Debes enviar un texto para hacer un tag.`, m)

  // 🔹 Sender normalizado
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

  try {
    // ✅ JIDs bien normalizados
    let users = participants.map(u => normalizeJid(conn, u.id))

    let q = m.quoted ? m.quoted : m
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender

    let msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted
            ? c.message[q.mtype]
            : { text: c }
        },
        { quoted: null, userJid: conn.user.id }
      ),
      text || q.text || '',
      conn.decodeJid(conn.user.id),
      { mentions: users }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch {
    let users = participants.map(u => normalizeJid(conn, u.id))

    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''
    let isMedia = /image|video|sticker|audio/.test(mime)

    let more = String.fromCharCode(8206)
    let masss = more.repeat(850)
    let htextos = `${text ? text : '*¡¡¡Hola!!!*'}`

    if (isMedia && quoted.mtype === 'imageMessage') {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, {
        image: mediax,
        mentions: users,
        caption: htextos
      }, { quoted: null })

    } else if (isMedia && quoted.mtype === 'videoMessage') {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, {
        video: mediax,
        mentions: users,
        mimetype: 'video/mp4',
        caption: htextos
      }, { quoted: null })

    } else if (isMedia && quoted.mtype === 'audioMessage') {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, {
        audio: mediax,
        mentions: users,
        mimetype: 'audio/mp4',
        fileName: `Hidetag.mp3`
      }, { quoted: null })

    } else if (isMedia && quoted.mtype === 'stickerMessage') {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, {
        sticker: mediax,
        mentions: users
      }, { quoted: null })

    } else {
      await conn.relayMessage(m.chat, {
        extendedTextMessage: {
          text: `${masss}\n${htextos}\n`,
          contextInfo: {
            mentionedJid: users
          }
        }
      })
    }
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = false // 🔥 importante

export default handler
