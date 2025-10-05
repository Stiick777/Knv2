let handler = async (m, { conn }) => {
const userLid = m.sender
await conn.sendMessage(m.chat, { text: `Tu LID es: ${userLid}` }, { quoted: m })
}


handler.command = ['mylid', 'lid']

export default handler
