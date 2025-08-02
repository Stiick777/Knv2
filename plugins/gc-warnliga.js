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
    const warntext = `*[❗] ETIQUETE A UNA PERSONA O RESPONDA A UN MENSAJE DEL GRUPO PARA ADVERTIR*\n\n*—◉ EJEMPLO:*\n*${usedPrefix + command} @usuario motivo*`;
    return m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  // Asegurar que el usuario exista en la base de datos
  if (!global.db.data.users[who]) {
    global.db.data.users[who] = {
      warn: 0,
      warnReasons: []
    };
  }

  const user = global.db.data.users[who];
  const motivo = text ? text.replace(/@\d+-?\d* /g, '') : 'No especificado';

  // Aumenta advertencia y guarda motivo
  user.warn += 1;
  user.warnReasons.push(motivo);

  await m.reply(
    `*@${who.split`@`[0]}* recibió una advertencia!\nMotivo: ${motivo}\n*ADVERTENCIAS ${user.warn}/3*`,
    null,
    { mentions: [who] }
  );

  // Si llega a 3 advertencias
  if (user.warn >= 3) {
    let razones = user.warnReasons.map((r, i) => `• ${i + 1}. ${r}`).join('\n');

    await m.reply(
      `@${who.split`@`[0]} Has cometido las 3 advertencias y seras expulsado de la liga.\n\n*Motivos:*\n${razones}`,
      null,
      { mentions: [who] }
    );

    // Resetea advertencias y motivos
    user.warn = 0;
    user.warnReasons = [];
  }

  return !1;
};

handler.command = /^(warnt)$/i;
handler.admin = true;
handler.group = true;
export default handler;