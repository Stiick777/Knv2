import fetch from 'node-fetch'

const isLinkSocial = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:tiktok\.com|youtube\.com|youtu\.be|telegram\.me|t\.me|facebook\.com|fb\.me|instagram\.com|threads\.net|twitter\.com|x\.com|snapchat\.com|spotify\.com|discord\.gg|reddit\.com|linkedin\.com|pinterest\.com|twitch\.tv|kick\.com|onlyfans\.com|patreon\.com|github\.com)/i

let handler = m => m
handler.before = async function (m, { conn, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return !0
    if (!m.isGroup) return !1

    let chat = global.db.data.chats[m.chat]
    let bot = global.db.data.settings[this.user.jid] || {}
    let delet = m.key.participant
    let bang = m.key.id
    let toUser = `${m.sender.split("@")[0]}`
    let aa = toUser + '@s.whatsapp.net'
    
    if (chat.antiLink && isLinkSocial.test(m.text)) {
        if (isBotAdmin) {
            await conn.reply(m.chat, `『✦』Se detectó un enlace prohibido.\nSerás eliminado/a: *@${toUser}*`, null, { mentions: [aa] })
            await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        } else {
            return m.reply(`『✦』El bot no es admin, no puedo eliminar personas.`)
        }
    }

    return !0
}

export default handler
