let handler = async (m, { conn }) => {
  let usersWithWarns = Object.entries(global.db.data.users)
    .filter(([_, user]) => user.warn && user.warn > 0);

  if (!usersWithWarns.length) {
    return m.reply('✅ No hay usuarios con advertencias activas.');
  }

  let caption = `⚠️ *LISTA DE USUARIOS CON ADVERTENCIAS*\n`;
  caption += `*Total:* ${usersWithWarns.length} usuario(s)\n`;
  caption += `────────────────────────\n`;

  for (let i = 0; i < usersWithWarns.length; i++) {
    let [jid, user] = usersWithWarns[i];
    let nombre = await conn.getName(jid).catch(_ => 'Sin nombre');

    caption += `\n*${i + 1}.* ${nombre} (@${jid.split`@`[0]})`;
    caption += `\nAdvertencias: *${user.warn}/3*`;

    if (user.warnReasons && user.warnReasons.length > 0) {
      caption += `\nMotivos:`;
      user.warnReasons.forEach((razon, idx) => {
        caption += `\n   ${idx + 1}. ${razon}`;
      });
    } else {
      caption += `\nMotivos: No especificados.`;
    }

    caption += `\n────────────────────────`;
  }

  await conn.reply(m.chat, caption, m, { mentions: conn.parseMention(caption) });
};

handler.command = /^(listwarns|listawarns|warnslist)$/i;
handler.admin = true;
handler.group = true;

export default handler;