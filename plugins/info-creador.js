let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Stiiven⁩;;\nFN:Stiiven⁩\nTITLE:\nitem1.TEL;waid=5216645011701:5216645011701\nitem1.X-ABLabel:Stiiven\nitem2.URL:https://wa.me/5216645011701\nitem2.X-ABLabel:Enviar Mensaje\nEND:VCARD`;
    await conn.sendMessage(m.chat, { contacts: { displayName: 'KanBot⁩', contacts: [{ vcard }] }}, { quoted: m });
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
