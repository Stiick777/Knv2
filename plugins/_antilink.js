// Detectar links de grupos y canales
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

  const isGroupLink = linkRegex.test(m.text);

  // No hay anti-link o no hay link → salir
  if (!chat.antiLink || !isGroupLink) return !0;

  // Enlaces permitidos → ignorar
  if (allowedLinks.some(link => m.text.includes(link))) return !0;

  // SI ES ADMIN → NO HACER NADA
  if (isAdmin) return !0;

  // Verificar si el bot es admin
  if (!isBotAdmin) {
    return conn.reply(m.chat, `⚡ *No soy admin, no puedo eliminar intrusos*`, m);
  }

  // Verificar si es el enlace del propio grupo
  const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
  if (m.text.includes(linkThisGroup)) return !0;

  // Eliminar mensaje
  await conn.sendMessage(m.chat, {
    delete: { 
      remoteJid: m.chat, 
      fromMe: false, 
      id: bang, 
      participant: delet 
    }
  });

  // Expulsar al usuario
  await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');

  await conn.sendMessage(m.chat, {
    text: `🚫 Se eliminó a @${m.sender.split('@')[0]} por enviar un enlace prohibido.`,
    mentions: [m.sender]
  });

  return !0;
}
