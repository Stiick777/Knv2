conn.ev.removeAllListeners('group-participants.update')

conn.ev.on('group-participants.update', async (update) => {
  try {
    console.log('GROUP UPDATE:')
    console.log(JSON.stringify(update, null, 2))

    const groupId = update.id
    const participants = update.participants || []

    const action =
      update.action ||
      update.type ||
      update.event ||
      ''

    const groupMetadata = await conn.groupMetadata(groupId)

    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    for (const participant of participants) {
      try {
        const jid =
          typeof participant === 'string'
            ? participant
            : participant.phoneNumber || participant.id

        console.log('JID:', jid)
        console.log('ACTION:', action)

        let pp = 'https://i.imgur.com/w1Jw7dl.jpeg'

        try {
          pp = await conn.profilePictureUrl(jid, 'image')
        } catch {}

        let nombre = 'Usuario'

        try {
          nombre =
            await conn.getName(jid) ||
            jid.split('@')[0]
        } catch {
          nombre = jid.split('@')[0]
        }

        // BIENVENIDA
        if (
          ['add', 'invite', 'join'].includes(action)
        ) {
          const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Bienvenido, ✰ @${jid.split('@')[0]}!
A ${groupMetadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Nos alegra tenerte aquí.
🌸*ੈ✩‧₊˚༺☆༻*ੈ✩˚🌸
`

          await conn.sendMessage(groupId, {
            image: { url: pp },
            caption: texto,
            mentions: [jid]
          })

          console.log('✅ Bienvenida enviada')
        }

        // DESPEDIDA
        if (
          ['remove', 'leave'].includes(action)
        ) {
          const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Adiós, ✰ @${jid.split('@')[0]}!
DE ${groupMetadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Gracias por haber estado con nosotros.
🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁
`

          await conn.sendMessage(groupId, {
            image: { url: pp },
            caption: texto,
            mentions: [jid]
          })

          console.log('✅ Despedida enviada')
        }
      } catch (err) {
        console.error('Error participante:', err)
      }
    }
  } catch (e) {
    console.error('Error en bienvenida:', e)
  }
})
