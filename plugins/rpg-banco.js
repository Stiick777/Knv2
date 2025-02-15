import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender; // Obtiene el usuario mencionado o el que envió el mensaje
    let user = global.db.data.users[who];

    if (!user) return m.reply('⚠️ El usuario no está registrado en la base de datos.');

    let { exp, estrellas, bank } = user;

    let mensaje = `🏦 *Banco KanBot* 🏦\n\n` +
                  `👤 *Usuario:* @${who.split('@')[0]}\n` +
                  `⭐ *Estrellas por fuera:* ${estrellas || 0}\n` +
                  `💰 *Estrellas en el banco:* ${bank || 0}\n` +
                  `📈 *Experiencia:* ${exp || 0} XP`;

    conn.sendMessage(m.chat, { text: mensaje, mentions: [who] }, { quoted: m });
};

handler.help = ['banco'];
handler.tags = ['rpg'];
handler.command = ['banco', 'xp', 'stars'];
handler.group = true

export default handler;
