export async function before(m, { conn }) {
  conn.ev.on('group-participants.update', async (update) => {
    try {
      const { id, participants, action } = update

      for (const user of participants) {
        const jid = user.phoneNumber || user.id

        if (action === 'add') {
          await conn.sendMessage(id, {
            text: `👋 Bienvenido @${jid.split('@')[0]}`,
            mentions: [jid]
          })
        }

        if (action === 'remove') {
          await conn.sendMessage(id, {
            text: `👋 Hasta luego @${jid.split('@')[0]}`,
            mentions: [jid]
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  })
}
