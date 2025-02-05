const handler = async (m, {usedPrefix}) => {
  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
  else who = m.sender;
  const name = conn.getName(who);
  m.reply(`╭━〔  ${global.packname}  〕⬣
┋🚩 *Usuario:* ${name}
┋💰 *Experiencia:* ${global.db.data.users[who].exp}
╰━━━━━━━━━━━━⬣`)
};
handler.help = ['bal'];
handler.tags = ['rpg'];
handler.command = ['bal', 'diamantes', 'diamond', 'balance'];
handler.group = true;
export default handler;
