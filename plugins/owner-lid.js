let handler = async (m, { conn }) => {
const userLid = m.sender
await conn.sendMessage(m.chat, { text: `Tu LID es: ${userLid}` }, { quoted: m })
}

handler.help = ['mylid', 'lid']
handler.tags = ['info']
handler.command = ['mylid', 'lid']

export default handler
