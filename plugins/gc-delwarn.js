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
  const warntext = `*[❗] 𝙴𝚃𝙸𝚀𝚄𝙴𝚃𝙴 𝙰 𝚄𝙽𝙰 𝙿𝙴𝚁𝚂𝙾𝙽𝙰 𝙾 𝚁𝙴𝚂𝙿𝙾𝙽𝙳𝙰 𝙰 𝚄𝙽 𝙼𝙴𝙽𝚂𝙰𝙹𝙴 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾 𝙿𝙰𝚁𝙰 𝙴𝙻𝙸𝙼𝙸𝙽𝙰𝚁 𝚄𝙽𝙰 𝙰𝙳𝚅𝙴𝚁𝚃𝙴𝙽𝙲𝙸𝙰*\n\n*—◉ 𝙴𝙹𝙴𝙼𝙿𝙻𝙾:*\n*${
    usedPrefix + command
  } @${global.suittag}*`;

  if (!who) {
    throw m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  if (user.warn > 0) {
    user.warn -= 1;
    await m.reply(
      `*@${who.split`@`[0]}* 𝚂𝙴 𝙷𝙰 𝙴𝙻𝙸𝙼𝙸𝙽𝙰𝙳𝙾 𝚄𝙽𝙰 𝙰𝙳𝚅𝙴𝚁𝚃𝙴𝙽𝙲𝙸𝙰.\nMotivo: ${sdms}\n*ADVERTENCIAS RESTANTES: ${user.warn}/3*`,
      null,
      { mentions: [who] }
    );
  } else {
    await m.reply(
      `*@${who.split`@`[0]}* 𝙽𝙾 𝙷𝙰𝚈 𝙰𝙳𝚅𝙴𝚁𝚃𝙴𝙽𝙲𝙸𝙰𝚂 𝚀𝚄𝙴 𝙴𝙻𝙸𝙼𝙸𝙽𝙰𝚁.`,
      null,
      { mentions: [who] }
    );
  }

  return !1;
};

handler.command = /^(eliminaradvertencia|removewarn|delwarn)$/i;
handler.tags = ['grupo'];
handler.help = ['delwarn'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
