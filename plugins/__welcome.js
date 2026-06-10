conn.ev.on('group-participants.update', async (update) => {
  try {
    const { id, participants, action } = update

    const groupMetadata = await conn.groupMetadata(id)

    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    for (const user of participants) {
      const jid = user.phoneNumber || user.id

      console.log('========================')
      console.log('USER:', JSON.stringify(user, null, 2))

      try {
        console.log('GETNAME:', await conn.getName(jid))
      } catch (e) {
        console.log('GETNAME ERROR:', e.message)
      }

      const participantData = groupMetadata.participants.find(
        p => p.id === jid || p.id === user.id
      )

      console.log(
        'PARTICIPANT:',
        JSON.stringify(participantData, null, 2)
      )

      let username = 'Usuario'

      try {
        username =
          participantData?.notify ||
          participantData?.name ||
          participantData?.verifiedName ||
          await conn.getName(jid) ||
          jid.split('@')[0]
      } catch {
        username = jid.split('@')[0]
      }

      let pp = 'https://i.imgur.com/JP4hV4D.jpeg'

      try {
        pp = await conn.profilePictureUrl(jid, 'image')
      } catch {}

      if (action === 'add') {
        const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Bienvenido, ✰ ${username}!
A ${groupMetadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Nos alegra tenerte aquí.
🌸*ੈ✩‧₊˚༺☆༻*ੈ✩˚🌸
`

        await conn.sendMessage(id, {
          image: { url: pp },
          caption: texto,
          mentions: [jid]
        })
      }

      if (action === 'remove') {
        const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Adiós, ✰ ${username}!
DE ${groupMetadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Gracias por haber estado con nosotros.
🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁
`

        await conn.sendMessage(id, {
          image: { url: pp },
          caption: texto,
          mentions: [jid]
        })
      }
    }
  } catch (e) {
    console.error('Error en bienvenida:', e)
  }
})
