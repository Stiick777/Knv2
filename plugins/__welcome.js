import chalk from 'chalk'
import moment from 'moment-timezone'

export const participantsUpdate = async (client, anu) => {
    console.log(JSON.stringify(anu, null, 2))
    try {
        const metadata = await client.groupMetadata(anu.id)
        const chat = global.db.data.chats[anu.id]
        const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
        const primaryBotId = chat?.primaryBot

        const now = new Date()
        const colombianTime = new Date(
            now.toLocaleString('en-US', {
                timeZone: 'America/Bogota'
            })
        )

        const tiempo = colombianTime
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
            .replace(/,/g, '')

        const tiempo2 = moment
            .tz('America/Bogota')
            .format('hh:mm A')

        let memberCount = metadata.participants.length

        if (anu.action === 'add') memberCount += 1
        if (anu.action === 'remove' || anu.action === 'leave') memberCount -= 1

        for (const p of anu.participants) {
            const jid = p.phoneNumber || p
            const phone = jid.split('@')[0]

            const pp = await client
                .profilePictureUrl(jid, 'image')
                .catch(
                    () =>
                        'https://cdn.sockywa.xyz/files/1755559736781.jpeg'
                )

            
            const fakeContext = {
    contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363000000000000@newsletter',
            serverMessageId: '0',
            newsletterName: '☆KanBot☆'
        },
        externalAdReply: {
    title: '☆KanBot☆',
    body: 'by Stiiven',
    mediaUrl: null,
    description: null,
    previewType: 'PHOTO',
    thumbnailUrl: 'https://i.ibb.co/p6nb9fyN/IMG-20210703-WA0333.jpg',
    sourceUrl: 'https://chat.whatsapp.com/FhJrUdTpY8AL9jXcmb4ohT',
    mediaType: 1,
    renderLargerThumbnail: false
        },
        mentionedJid: [jid, anu.author].filter(Boolean)
    }
            }

            // BIENVENIDA
            if (
                anu.action === 'add' &&
                chat?.welcome &&
                (!primaryBotId || primaryBotId === botId)
            ) {
                const fecha = `${tiempo} • ${tiempo2}`

                const caption = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Bienvenido/a, ✰ @${phone}
A ${metadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Esperamos que disfrutes tu estancia en el grupo.
*_Recuerda leer la descripción_*
🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁`

                await client.sendMessage(
                    anu.id,
                    {
                        image: { url: pp },
                        caption,
                        mentions: [jid],
                        ...fakeContext
                    }
                )
            }

            // DESPEDIDA
            if (
                (anu.action === 'remove' ||
                    anu.action === 'leave') &&
                chat?.welcome &&
                (!primaryBotId || primaryBotId === botId)
            ) {
                const fecha = `${tiempo} • ${tiempo2}`

                const caption = `
╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮
¡Adiós, ✰ @${phone}
DE ${metadata.subject}
● ${fecha}
╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯

Gracias por haber estado con nosotros.
🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁`

                await client.sendMessage(
                    anu.id,
                    {
                        image: { url: pp },
                        caption,
                        mentions: [jid],
                        ...fakeContext
                    }
                )
            }

            // PROMOVER
            if (
                anu.action === 'promote' &&
                chat?.alerts &&
                (!primaryBotId || primaryBotId === botId)
            ) {
                const usuario = anu.author

                await client.sendMessage(anu.id, {
                    text: `「✎」 *@${phone}* ha sido promovido a Administrador por *@${
                        usuario?.split('@')[0] || 'Sistema'
                    }.*`,
                    mentions: [jid, usuario].filter(Boolean)
                })
            }

            // DEGRADAR
            if (
                anu.action === 'demote' &&
                chat?.alerts &&
                (!primaryBotId || primaryBotId === botId)
            ) {
                const usuario = anu.author

                await client.sendMessage(anu.id, {
                    text: `「✎」 *@${phone}* ha sido degradado de Administrador por *@${
                        usuario?.split('@')[0] || 'Sistema'
                    }.*`,
                    mentions: [jid, usuario].filter(Boolean)
                })
            }
        }
    } catch (err) {
        console.log(
            chalk.gray(`[ EVENT ERROR ] → ${err}`)
        )
    }
        }
