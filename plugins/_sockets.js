import ws from 'ws'

const handler = async (m, { conn }) => {
  // Filtra los sockets activos
  const subBots = [...new Set([...global.conns
    .filter((c) => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)
    .map((c) => c.user.jid)])]

  // Incluye el bot principal si no está en la lista
  if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
    subBots.push(global.conn.user.jid)
  }

  if (!subBots.length) {
    return conn.reply(m.chat, '🚫 *No hay sockets activos.*', m)
  }

  // Construye el mensaje con índice, mención y link
  const text = subBots.map((jid, i) => 
`╭─⬣「 𝐒𝐎𝐂𝐊𝐄𝐓 #${i+1} 」⬣
│🎈 TAG: @${jid.split('@')[0]}
│🔥 LINK: https://wa.me/${jid.split('@')[0]}
│📍 JID: ${jid}
╰──────────────────⬣`).join('\n\n')

  await conn.sendMessage(m.chat, { 
    text: `╭━〔 𝗦𝗢𝗖𝗞𝗘𝗧𝗦 𝗔𝗖𝗧𝗜𝗩𝗢𝗦 〕⬣
┃ ⚡ *Total:* ${subBots.length}
╰━━━━━━━━━━━━━━━━⬣

${text}`,
    mentions: subBots
  }, { quoted: m })
}

handler.help = ['listsockets']
handler.tags = ['grupo']
handler.command = ['listsockets', 'sockets']

export default handler