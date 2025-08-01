const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (m.mentionedJid.includes(conn.user.jid)) return;

  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : text;
  } else who = m.chat;

  const user = global.db.data.users[who];
  const dReason = 'No especificado';
  const msgtext = text || dReason;
  const sdms = msgtext.replace(/@\d+-?\d* /g, '');
  const warntext = `*[❗] ETIQUETE A UNA PERSONA O RESPONDA A UN MENSAJE DEL GRUPO PARA ELIMINAR UNA ADVERTENCIA*\n\n*—◉ EJEMPLO:*\n*${usedPrefix + command} @${global.suittag}*`;

  if (!who) {
    throw m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  if (user.warn > 0) {
    user.warn -= 1;
    if (Array.isArray(user.warnReasons) && user.warnReasons.length > 0) {
      user.warnReasons.pop(); // Elimina la última razón
    }
    await m.reply(
      `*@${who.split`@`[0]}* Se ha eliminado una advertencia.\nMotivo eliminado: ${sdms}\n*Advertencias restantes: ${user.warn}/3*`,
      null,
      { mentions: [who] }
    );
  } else {
    await m.reply(
      `*@${who.split`@`[0]}* No hay advertencias que eliminar.`,
      null,
      { mentions: [who] }
    );
  }

  return !1;
};

handler.command = /^(delwarnt)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;