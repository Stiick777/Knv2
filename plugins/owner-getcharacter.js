import fs from 'fs'
let handler = async (m, { conn, text }) => {
    await m.react('🕓')
    let dl_url = await fs.readFileSync('./src/database/characters.json')
    await conn.sendMessage(m.chat, { document: dl_url, mimetype: 'application/json', fileName: 'characters.json' }, { quoted: m })
    await m.react('✅')
}
handler.help = ['getchar']
handler.tags = ['owner']
handler.command = /^(getchar)$/i

handler.rowner = true


export default handler
