// Detectar links de grupos y canales (con parámetros al final)
let linkRegex = /https?:\/\/(?:chat\.whatsapp\.com\/[A-Za-z0-9]+(?:\?[^\s]*)?|whatsapp\.com\/channel\/[A-Za-z0-9]+(?:\?[^\s]*)?)/i;

let allowedLinks = [
  "https://chat.whatsapp.com/HDoyT3SlpYzBlpawlWNpKw?mode=ems_copy_c",
  "https://whatsapp.com/channel/0029VakhAHc5fM5hgaQ8ed2N"
];

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;

  let chat = global.db.data.chats[m.chat];
  let delet = m.key.participant;
  let bang = m.key.id;
  let bot = global.db.data.settings[this.user.jid] || {};

  const isGroupLink = linkRegex.exec(m.text);
  const grupo = `https://chat.whatsapp.com`;

  // Permitir admins
  if (isAdmin && chat.antiLink && isGroupLink) {
    return conn.reply(m.chat, `⚠️ *El anti-link está activo, pero eres admin.*`, m);
  }

  if (chat.antiLink && isGroupLink && !isAdmin) {
    // Permitir solo los enlaces de la lista
    if (allowedLinks.some(link => m.text.includes(link))) {
      return !0;
    }

    // Ignorar si es el link de este mismo grupo
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }

    if (!isBotAdmin) {
      return conn.reply(m.chat, `⚡ *No soy admin, no puedo eliminar intrusos*`, m);
    }

    // Eliminar mensaje y expulsar usuario
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    await conn.sendMessage(m.chat, { text: `🚫 Se eliminó a @${m.sender.split('@')[0]} por enviar un enlace prohibido.`, mentions: [m.sender] });
  }

  return !0;
}
