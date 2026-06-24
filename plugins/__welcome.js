import fetch from 'node-fetch'

conn.ev.removeAllListeners('group-participants.update')

conn.ev.on('group-participants.update', async (update) => {
  try {
    console.log('==================== GROUP UPDATE ====================')
    console.log(JSON.stringify(update, null, 2))

    const groupId = update.id
    if (!groupId) return

    const groupMetadata = await conn.groupMetadata(groupId).catch(() => null)
    if (!groupMetadata) return

    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    // Detectar acción real aunque action/type vengan undefined
    let eventType =
      update.action ||
      update.type ||
      update.event ||
      update.stubType ||
      ''

    // Normalizar a string
    if (typeof eventType !== 'string') eventType = String(eventType)

    console.log('EVENT TYPE RAW:', eventType)

    // participantes del evento
    let participants = update.participants || []

    // Si no vienen participantes, intentar leerlos de otras propiedades
    if (!participants.length && update.messageStubParameters) {
      participants = update.messageStubParameters
    }

    // Normalizar tipo de evento
    let isAdd = false
    let isRemove = false

    const upperType = eventType.toUpperCase()

    if (
      upperType.includes('GROUP_PARTICIPANT_ADD') ||
      eventType === 'add' ||
      eventType === '27' ||
      update.messageStubType === 27
    ) {
      isAdd = true
    }

    if (
      upperType.includes('GROUP_PARTICIPANT_REMOVE') ||
      eventType === 'remove' ||
      eventType === '28' ||
      update.messageStubType === 28
    ) {
      isRemove = true
    }

    console.log('IS ADD:', isAdd)
    console.log('IS REMOVE:', isRemove)
    console.log('PARTICIPANTS RAW:', participants)

    for (const rawUser of participants) {
      try {
        let jid = null
        let lid = null
        let phoneJid = null
        let username = 'Usuario'

        console.log('RAW USER:', rawUser)

        // Caso 1: viene como string JSON dentro de messageStubParameters
        if (typeof rawUser === 'string') {
          try {
            const parsed = JSON.parse(rawUser)

            lid = parsed.id || null
            phoneJid = parsed.phoneNumber || null

            // preferir el número real @s.whatsapp.net para menciones/nombre/foto
            jid = phoneJid || lid

            console.log('PARSED USER:', parsed)
          } catch {
            // si no es JSON, puede ser directamente un jid
            jid = rawUser
          }
        }

        // Caso 2: viene como objeto normal
        else if (typeof rawUser === 'object' && rawUser !== null) {
          lid = rawUser.id || null
          phoneJid = rawUser.phoneNumber || null
          jid = phoneJid || lid
        }

        if (!jid) continue

        console.log('JID FINAL:', jid)
        console.log('LID:', lid)
        console.log('PHONE JID:', phoneJid)

        // Buscar participante dentro del grupo por cualquiera de los IDs
        const participantData = groupMetadata.participants.find(p =>
          p.id === jid ||
          p.id === lid ||
          p.id === phoneJid
        )

        console.log('PARTICIPANT DATA:', participantData)

        // Nombre
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

        // Foto
        let pp = 'https://i.imgur.com/JP4hV4D.jpeg'
        try {
          pp = await conn.profilePictureUrl(jid, 'image')
        } catch {
          try {
            if (phoneJid) pp = await conn.profilePictureUrl(phoneJid, 'image')
          } catch {}
        }

        // número visible para mención
        const numeroVisible = (phoneJid || jid).split('@')[0]
        const mentionJid = phoneJid || jid

        // BIENVENIDA
        if (isAdd) {
          const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Bienvenido, ✰ @${numeroVisible}!
A ${groupMetadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Nos alegra tenerte aquí.
🌸*ੈ✩‧₊˚༺☆༻*ੈ✩˚🌸
`.trim()

          await conn.sendMessage(groupId, {
            image: { url: pp },
            caption: texto,
            mentions: [mentionJid]
          })

          console.log(`✅ Bienvenida enviada a ${mentionJid}`)
        }

        // DESPEDIDA
        if (isRemove) {
          const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Adiós, ✰ @${numeroVisible}!
DE ${groupMetadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Gracias por haber estado con nosotros.
🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁
`.trim()

          await conn.sendMessage(groupId, {
            image: { url: pp },
            caption: texto,
            mentions: [mentionJid]
          })

          console.log(`✅ Despedida enviada a ${mentionJid}`)
        }

      } catch (err) {
        console.error('❌ Error procesando participante:', err)
      }
    }
  } catch (e) {
    console.error('❌ Error en bienvenida/despedida:', e)
  }
})
