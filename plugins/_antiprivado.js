export async function before(m, { conn, isOwner, isROwner }) {
  try {
    if (m.isBaileys && m.fromMe) return !0
    if (m.isGroup) return !1
    if (!m.message) return !0

    const bot = global.db.data.settings?.[conn.user.jid] || {}
    if (!bot.antiPrivate || isOwner || isROwner) return !1

    const sender = m.sender || m.chat || ''

    console.log('\n========== DEBUG LID / PN ==========')
    console.log('m.sender:', m.sender)
    console.log('m.chat:', m.chat)
    console.log('m.participant:', m.participant)
    console.log('m.pushName:', m.pushName)

    console.log('\n--- m.key ---')
    console.log(JSON.stringify(m.key, null, 2))

    console.log('\n--- conn.chats?.[sender] ---')
    const chat = conn.chats?.[sender]
    console.log(chat)

    if (chat?.messages) {
      const entries = Object.entries(chat.messages).slice(0, 5) // primeras 5
      console.log('\n--- keys de mensajes guardados en chat.messages ---')
      for (const [msgId, msgData] of entries) {
        console.log(`\n[MSG ID] ${msgId}`)
        try {
          console.log(JSON.stringify(msgData?.key || {}, null, 2))
        } catch {
          console.log(msgData?.key)
        }
      }
    }

    await m.reply(
      `DEBUG 2 activo para @${sender.split('@')[0]}`,
      false,
      { mentions: [sender] }
    )

    console.log('====================================\n')
    return !1
  } catch (e) {
    console.error('❌ ERROR DEBUG LID 2:', e)
    return !1
  }
}
