export async function before(m, { conn, groupMetadata }) {
  if (!m.isGroup) return

  //const chat = global.db.data.chats[m.chat]
  //if (!chat || !chat.welcome) return

  let metadata = groupMetadata || await conn.groupMetadata(m.chat).catch(() => null)
  if (!metadata) return

  const fecha = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const defaultPP = 'https://i.imgur.com/w1Jw7dl.jpeg'

  const getUserPP = async (jid) => {
    try {
      return await conn.profilePictureUrl(jid, 'image')
    } catch {
      return defaultPP
    }
  }

  if (m.messageStubType === 27 || m.messageStubType === 31) {
    let users = m.messageStubParameters || []

    for (const user of users) {
      let numeroVisible = user.split('@')[0]
      let pp = await getUserPP(user)

      let texto = `╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Bienvenido, ✰ @${numeroVisible}!
A ${metadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Nos alegra tenerte aquí.
🌸*ੈ✩‧₊˚༺☆༻*ੈ✩˚🌸`

      await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: texto,
        mentions: [user]
      })
    }
  }

  if (m.messageStubType === 28 || m.messageStubType === 32) {
    let users = m.messageStubParameters || []

    for (const user of users) {
      let numeroVisible = user.split('@')[0]
      let pp = await getUserPP(user)

      let texto = `╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Adiós, ✰ @${numeroVisible}!
DE ${metadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯`

      await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: texto,
        mentions: [user]
      })
    }
  }
}
