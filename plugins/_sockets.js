import ws from 'ws'

const handler = async (m, { conn, args }) => {
  const subBots = [...new Set([...global.conns
    .filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]

  if (global.conn?.user?.jid && !subBots.find(c => c.user.jid === global.conn.user.jid)) {
    subBots.push(global.conn)
  }

  const chat = global.db.data.chats[m.chat]

  function dhms(ms) {
    var segundos = Math.floor(ms / 1000)
    var minutos = Math.floor(segundos / 60)
    var horas = Math.floor(minutos / 60)
    var dias = Math.floor(horas / 24)

    segundos %= 60
    minutos %= 60
    horas %= 24

    var resultado = ""
    if (dias) resultado += dias + 'd '
    if (horas) resultado += horas + 'h '
    if (minutos) resultado += minutos + 'm '
    if (segundos) resultado += segundos + 's'
    return resultado.trim()
  }

  // --- Si no hay argumentos: listar sockets ---
  if (!args[0] && !m.mentionedJid?.length && !m.quoted) {
    if (!subBots.length) return conn.reply(m.chat, '🚫 *No hay sockets activos.*', m)

    const text = subBots.map((v, i) => {
      let jid = v.user.jid
      return `╭─⬣「 𝐒𝐎𝐂𝐊𝐄𝐓 #${i + 1} 」⬣
│🎈 TAG: @${jid.split('@')[0]}
│🔥 LINK: https://wa.me/${jid.split('@')[0]}
│📍 JID: ${jid}
│⏳ RUNTIME: ${v.uptime ? dhms(Date.now() - v.uptime) : "Desconocido"}
╰──────────────────⬣`
    }).join('\n\n')

    return conn.sendMessage(m.chat, {
      text: `╭━〔 𝗦𝗢𝗖𝗞𝗘𝗧𝗦 𝗔𝗖𝗧𝗜𝗩𝗢𝗦 〕⬣
┃ ⚡ *Total:* ${subBots.length}
┃ > Para dejar un socket como primario usa: *.sockets 1*
┃ > Para volver al bot principal usa: *.sockets 0* o *.sockets off*
╰━━━━━━━━━━━━━━━━⬣

${text}`,
      mentions: subBots.map(v => v.user.jid)
    }, { quoted: m })
  }

  // --- Si el argumento es "0", "off" o "reset" → volver al bot principal ---
  if (args[0] === '0' || args[0]?.toLowerCase() === 'off' || args[0]?.toLowerCase() === 'reset') {
    delete chat.primaryBot
    return conn.reply(m.chat, '✅ Se ha restablecido el bot principal. Ahora los comandos se ejecutarán normalmente.', m)
  }

  // --- Si hay argumento: set primary ---
  let who = null

  if (args[0] && !isNaN(args[0])) {
    let index = parseInt(args[0]) - 1
    if (index >= 0 && index < subBots.length) {
      who = subBots[index].user.jid
    }
  }

  if (!who) {
    const mentionedJid = m.mentionedJid || []
    if (mentionedJid.length > 0) who = mentionedJid[0]
    else if (m.quoted) who = m.quoted.sender
  }

  if (!who) {
    return conn.reply(m.chat, `❀ Usa el comando de estas formas:
> .sockets → lista los sockets activos
> .sockets 2 → establece el #2 como primario
> .sockets @usuario → establece ese socket como primario
> .sockets 0 → restablece al bot principal`, m)
  }

  if (!subBots.find(c => c.user.jid === who)) {
    return conn.reply(m.chat, `ꕥ El usuario/índice no corresponde a un socket activo.`, m)
  }

  if (chat.primaryBot === who) {
    return conn.reply(m.chat, `ꕥ @${who.split`@`[0]} ya es el Bot primario en este grupo.`, m, { mentions: [who] })
  }

  try {
    chat.primaryBot = who
    conn.reply(m.chat, `❀ Se ha establecido a @${who.split`@`[0]} como Bot primario de este grupo.\n> Ahora todos los comandos serán ejecutados por @${who.split`@`[0]}.`, m, { mentions: [who] })
  } catch (e) {
    conn.reply(m.chat, `⚠︎ Ocurrió un error.\n\n${e.message}`, m)
  }
}

handler.help = ['sockets']
handler.tags = ['jadibot']
handler.command = ['sockets', 'listsockets']
handler.group = true
handler.admin = true

export default handler
