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

  if (!who) {
    let warntext = `*[❗] ETIQUETE A UNA PERSONA O RESPONDA A UN MENSAJE DEL GRUPO PARA ELIMINAR UNA ADVERTENCIA*\n\n*—◉ EJEMPLO:*\n*${usedPrefix + command} @usuario*`;
    throw m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  // Asegurar estructura de usuario en DB
  if (!global.db.data.users[who]) {
    global.db.data.users[who] = { warn: 0, warnReasons: [] };
  }

  let user = global.db.data.users[who];
  if (typeof user.warn !== 'number') user.warn = 0;
  if (!Array.isArray(user.warnReasons)) user.warnReasons = [];

  if (user.warn > 0) {
    user.warn -= 1;

    let motivoEliminado = user.warnReasons.pop() || "No especificado";

    await m.reply(
      `*@${who.split`@`[0]}* Se ha eliminado una advertencia.\nMotivo eliminado: ${motivoEliminado}\n*Advertencias restantes: ${user.warn}/3*`,
      null,
      { mentions: [who] }
    );
  } else {
    await m.reply(
      `*@${who.split`@`[0]}* No tiene advertencias para eliminar.`,
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