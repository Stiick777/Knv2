export async function before(m, { conn, isOwner, isROwner }) {
  try {
    if (m.isBaileys && m.fromMe) return !0
    if (m.isGroup) return !1
    if (!m.message) return !0

    const text = m.text || ''
    const bot = global.db.data.settings?.[conn.user.jid] || {}
    if (!bot.antiPrivate || isOwner || isROwner) return !1

    console.log('\n========== DEBUG LID / PN ==========')
    console.log('m.sender:', m.sender)
    console.log('m.chat:', m.chat)
    console.log('m.pushName:', m.pushName)
    console.log('m.name:', m.name)
    console.log('m.participant:', m.participant)
    console.log('m.key:', JSON.stringify(m.key, null, 2))
    console.log('m.message:', JSON.stringify(m.message, null, 2))

    console.log('\n--- conn.user ---')
    console.log(conn.user)

    console.log('\n--- conn.contacts[m.sender] ---')
    console.log(conn.contacts?.[m.sender])

    console.log('\n--- conn.contacts[m.chat] ---')
    console.log(conn.contacts?.[m.chat])

    // buscar coincidencias por número dentro de contacts
    const num = (m.sender || '').split('@')[0]
    console.log('\n--- buscando coincidencias en conn.contacts por número:', num, '---')

    const matches = []
    for (const [jid, data] of Object.entries(conn.contacts || {})) {
      if (jid.includes(num) || JSON.stringify(data).includes(num)) {
        matches.push({ jid, data })
      }
    }

    console.log('matches:', JSON.stringify(matches, null, 2))

    // revisar chats/store si existen
    console.log('\n--- conn.chats?.[m.sender] ---')
    console.log(conn.chats?.[m.sender])

    console.log('\n--- conn.chats?.[m.chat] ---')
    console.log(conn.chats?.[m.chat])

    // responder y no bloquear todavía
    await m.reply(
      `DEBUG activo para detectar LID de @${m.sender.split('@')[0]}`,
      false,
      { mentions: [m.sender] }
    )

    console.log('====================================\n')
    return !1
  } catch (e) {
    console.error('❌ ERROR DEBUG LID:', e)
    return !1
  }
}
