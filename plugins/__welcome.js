/*
conn.ev.removeAllListeners('group-participants.update')

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

  let pp = 'https://i.ibb.co/GQy5Xs9Q/ab67616d0000b2734c1b27da9aedb4417b843fcf.jpg'

  try {  
    pp = await conn.profilePictureUrl(jid, 'image')  
  } catch {}  

  if (action === 'add') {  
    const texto = `

╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Bienvenido, ✰ @${jid.split('@')[0]}!
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
¡Adiós, ✰ @${jid.split('@')[0]}!
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
*/
const processedEvents = new Set()

const DEFAULT_PP = 'https://i.ibb.co/GQy5Xs9Q/ab67616d0000b2734c1b27da9aedb4417b843fcf.jpg'

conn.ev.on('messages.upsert', async ({ messages }) => {

    try {

        const m = messages?.[0]
        if (!m) return

        if (!m.key?.remoteJid?.endsWith('@g.us')) return

        if (![27, 28].includes(m.messageStubType)) return

        const uniqueId = `${m.key.remoteJid}-${m.key.id}`

        if (processedEvents.has(uniqueId)) return

        processedEvents.add(uniqueId)

        setTimeout(() => processedEvents.delete(uniqueId), 60000)

        const groupId = m.key.remoteJid

        const metadata = await conn.groupMetadata(groupId)

        const fecha = new Date().toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })

        for (const parameter of m.messageStubParameters || []) {

            let lid = null
            let phone = null

            // FORMATO JSON
            if (
                typeof parameter === 'string' &&
                parameter.startsWith('{')
            ) {

                try {

                    const json = JSON.parse(parameter)

                    lid = json.id || null
                    phone = json.phoneNumber || null

                } catch {}

            }

            // FORMATO @s.whatsapp.net
            else if (
                typeof parameter === 'string' &&
                parameter.endsWith('@s.whatsapp.net')
            ) {

                phone = parameter

            }

            // FORMATO @lid
            else if (
                typeof parameter === 'string' &&
                parameter.endsWith('@lid')
            ) {

                lid = parameter

            }

            const jid = phone || lid

            if (!jid) continue

            console.log('==============================')
            console.log('EVENTO')
            console.log('LID:', lid)
            console.log('PHONE:', phone)
            console.log('JID:', jid)

            let nombre = jid.split('@')[0]

            try {

                nombre = await conn.getName(jid)

            } catch {

                if (phone) {

                    try {
                        nombre = await conn.getName(phone)
                    } catch {}

                }

            }

            let pp = DEFAULT_PP

            if (phone) {

                try {

                    pp = await conn.profilePictureUrl(phone, 'image')

                } catch {}

            }

            if (pp === DEFAULT_PP && lid) {

                try {

                    pp = await conn.profilePictureUrl(lid, 'image')

                } catch {}

            }

            if (m.messageStubType === 27) {

                const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Bienvenido, ✰ @${jid.split('@')[0]}!
A ${metadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Nos alegra tenerte aquí.
🌸*ੈ✩‧₊˚༺☆༻*ੈ✩˚🌸
`

                await conn.sendMessage(groupId, {
                    image: {
                        url: pp
                    },
                    caption: texto,
                    mentions: [jid]
                })

            }

            else if (m.messageStubType === 28) {

                const texto = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Adiós, ✰ @${jid.split('@')[0]}!
DE ${metadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Gracias por haber estado con nosotros.
🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁
`

                await conn.sendMessage(groupId, {
                    image: {
                        url: pp
                    },
                    caption: texto,
                    mentions: [jid]
                })

            }

        }

    } catch (err) {

        console.error('ERROR BIENVENIDA:', err)

    }

})
