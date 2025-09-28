import ws from 'ws'

const handler = async (m, { conn, args }) => {
  // Obtener objetos de subBots activos (NO solo el jid)
  const subBots = [...new Set([...global.conns
    .filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]

  // Agregar el bot principal si no está en la lista
  if (global.conn?.user?.jid && !subBots.find(c => c.user.jid === global.conn.user.jid)) {
    subBots.push(global.conn)
  }

  const chat = global.db.data.chats[m.chat]

  // Función para convertir ms → dias/horas/minutos
  function dhms(ms) {
    var segundos = Math.floor(ms / 1000);
    var minutos = Math.floor(segundos / 60);
    var horas = Math.floor(minutos / 60);
    var dias = Math.floor(horas / 24);

    segundos %= 60;
    minutos %= 60;
    horas %= 24;

    var resultado = "";
    if (dias !== 0) resultado += dias + 'd ';
    if (horas !== 0) resultado += horas + 'h ';
    if (minutos !== 0) resultado += minutos + 'm ';
    if (segundos !== 0) resultado += segundos + 's';

    return resultado.trim();
  }
  
  // --- Si no hay argumentos: listar sockets ---
  if (!args[0] && !m.mentionedJid?.length && !m.quoted) {
    if (!subBots.length) return conn.reply(m.chat, '🚫 *No hay sockets activos.*', m)

    const text = subBots.map((v, i) => {
      let jid = v.user.jid
      return `╭─⬣「 𝐒𝐎𝐂𝐊𝐄𝐓 #${i+1} 」⬣
│🎈 TAG: @${jid.split('@')[0]}
│🔥 LINK: https://wa.me/${jid.split('@')[0]}
│📍 JID: ${jid}
│⏳ RUNTIME: ${v.uptime ? dhms(Date.now() - v.uptime) : "Desconocido"}
╰──────────────────⬣`
    }).join('\n\n')

    return conn.sendMessage(m.chat, {
      text: `╭━〔 𝗦𝗢𝗖𝗞𝗘𝗧𝗦 𝗔𝗖𝗧𝗜𝗩𝗢𝗦 〕⬣
┃ ⚡ *Total:* ${subBots.length}
┃ > Para dejar un socket (Subbot) como primario usa: *.sockets 1* o el numero del socket que desea que sea principal 
╰━━━━━━━━━━━━━━━━⬣

${text}`,
      mentions: subBots.map(v => v.user.jid)
    }, { quoted: m })
  }

  // --- Si hay argumento: setprimary ---
  let who = null

  // Si se pasa un índice
  if (args[0] && !isNaN(args[0])) {
    let index = parseInt(args[0]) - 1
    if (index >= 0 && index < subBots.length) {
      who = subBots[index].user.jid
    }
  }

  // Si se pasa una mención
  if (!who) {
    const mentionedJid = m.mentionedJid || []
    if (mentionedJid.length > 0) who = mentionedJid[0]
    else if (m.quoted) who = m.quoted.sender
  }

  if (!who) {
    return conn.reply(m.chat, `❀ Usa el comando de estas formas:\n\n> .sockets → lista los sockets activos\n> .sockets 2 → establece el #2 como primario\n> .sockets @usuario → establece ese socket como primario`, m)
  }

  if (!subBots.find(c => c.user.jid === who)) {
    return conn.reply(m.chat, `ꕥ El usuario/índice no corresponde a un socket activo.`, m)
  }

  if (chat.primaryBot === who) {
    return conn.reply(m.chat, `ꕥ @${who.split`@`[0]} ya es el Bot primario en este grupo.`, m, { mentions: [who] })
  }

  try {
    chat.primaryBot = who
    conn.reply(m.chat, `❀ Se ha establecido a @${who.split`@`[0]} como Bot primario de este grupo.\n> Ahora todos los comandos de este grupo serán ejecutados por @${who.split`@`[0]}.`, m, { mentions: [who] })
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
