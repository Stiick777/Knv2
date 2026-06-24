import fetch from 'node-fetch'

const processedParticipants = new Set()

conn.ev.removeAllListeners('messages.upsert')

conn.ev.on('messages.upsert', async ({ messages }) => {
  try {
    const m = messages?.[0]
    if (!m) return

    const groupId = m.key?.remoteJid
    if (!groupId || !groupId.endsWith('@g.us')) return

    const stubType = m.messageStubType
    const stubParams = m.messageStubParameters || []

    // 27 = agregado / 28 = eliminado
    if (![27, 28].includes(stubType)) return

    console.log('================ SYSTEM STUB ================')
    console.log('GROUP ID:', groupId)
    console.log('STUB TYPE:', stubType)
    console.log('STUB PARAMS:', JSON.stringify(stubParams, null, 2))

    const groupMetadata = await conn.groupMetadata(groupId).catch(() => null)
    if (!groupMetadata) return

    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    for (const raw of stubParams) {
      try {
        let parsed = null
        let lid = null
        let phoneJid = null
        let jid = null

        // Si viene como JSON string
        if (typeof raw === 'string') {
          try {
            parsed = JSON.parse(raw)
            lid = parsed.id || null
            phoneJid = parsed.phoneNumber || null
            jid = phoneJid || lid
          } catch {
            jid = raw
          }
        } else if (typeof raw === 'object' && raw !== null) {
          lid = raw.id || null
          phoneJid = raw.phoneNumber || null
          jid = phoneJid || lid
        }

        if (!jid) continue

        // Evitar duplicados del mismo evento
        const uniqueKey = `${groupId}-${stubType}-${jid}-${m.key?.id || ''}`
        if (processedParticipants.has(uniqueKey)) continue
        processedParticipants.add(uniqueKey)
        setTimeout(() => processedParticipants.delete(uniqueKey), 60 * 1000)

        console.log('JID FINAL:', jid)
        console.log('PHONE JID:', phoneJid)
        console.log('LID:', lid)

        let pp = 'https://i.imgur.com/JP4hV4D.jpeg'
        try {
          pp = await conn.profilePictureUrl(jid, 'image')
        } catch {
          try {
            if (phoneJid) pp = await conn.profilePictureUrl(phoneJid, 'image')
          } catch {}
        }

        let username = 'Usuario'
        try {
          username =
            await conn.getName(phoneJid || jid) ||
            (phoneJid || jid).split('@')[0]
        } catch {
          username = (phoneJid || jid).split('@')[0]
        }

        const mentionJid = phoneJid || jid
        const numero = mentionJid.split('@')[0]

        // BIENVENIDA
        if (stubType === 27) {
          const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Bienvenido, ✰ @${numero}!
A ${groupMetadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Nos alegra tenerte aquí.
🌸*ੈ✩‧₊˚༺☆༻*ੈ✩˚🌸
`.trim()

          try {
            await conn.sendMessage(groupId, {
              image: { url: pp },
              caption: texto,
              mentions: [mentionJid]
            })
            console.log(`✅ Bienvenida enviada a ${mentionJid}`)
          } catch (err) {
            console.error('Error enviando bienvenida con imagen:', err)
            await conn.sendMessage(groupId, {
              text: texto,
              mentions: [mentionJid]
            })
            console.log(`✅ Bienvenida enviada en texto a ${mentionJid}`)
          }
        }

        // DESPEDIDA
        if (stubType === 28) {
          const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Adiós, ✰ @${numero}!
DE ${groupMetadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Gracias por haber estado con nosotros.
🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁
`.trim()

          try {
            await conn.sendMessage(groupId, {
              image: { url: pp },
              caption: texto,
              mentions: [mentionJid]
            })
            console.log(`✅ Despedida enviada a ${mentionJid}`)
          } catch (err) {
            console.error('Error enviando despedida con imagen:', err)
            await conn.sendMessage(groupId, {
              text: texto,
              mentions: [mentionJid]
            })
            console.log(`✅ Despedida enviada en texto a ${mentionJid}`)
          }
        }

      } catch (err) {
        console.error('❌ Error procesando stub participant:', err)
      }
    }

  } catch (e) {
    console.error('❌ Error en messages.upsert bienvenida/despedida:', e)
  }
})
