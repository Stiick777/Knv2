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

  const user = global.db.data.users[who] || {};
  if (!user.warn) user.warn = 0;
  if (!user.warnReasons) user.warnReasons = []; // Guardar motivos

  const dReason = 'No especificado';
  const motivo = text ? text.replace(/@\d+-?\d* /g, '') : dReason;

  const warntext = `*[❗] 𝙴𝚃𝙸𝚀𝚄𝙴𝚃𝙴 𝙰 𝚄𝙽𝙰 𝙿𝙴𝚁𝚂𝙾𝙽𝙰 𝙾 𝚁𝙴𝚂𝙿𝙾𝙽𝙳𝙰 𝙰 𝚄𝙽 𝙼𝙴𝙽𝚂𝙰𝙹𝙴 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾 𝙿𝙰𝚁𝙰 𝙰𝙳𝚅𝙴𝚁𝚃𝙸𝚁 𝙰𝙻 𝚄𝚂𝚄𝙰𝚁𝙸𝙾*\n\n*—◉ 𝙴𝙹𝙴𝙼𝙿𝙻𝙾:*\n*${
    usedPrefix + command
  } @usuario motivo*`;

  if (!who) {
    throw m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

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
    let razones = user.warnReasons
      .map((r, i) => `• ${i + 1}. ${r}`)
      .join('\n');

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