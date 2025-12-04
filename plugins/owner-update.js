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
  let sender = m.sender;
  let delet = m.key.participant;
  let bang = m.key.id;

  const isGroupLink = linkRegex.test(m.text);

  if (!chat.antiLink || !isGroupLink) return !0;

  if (allowedLinks.some(link => m.text.includes(link))) return !0;

  if (isAdmin) return !0; // Administradores no se sancionan

  // --- DIAGNÓSTICO REAL DEL GRUPO ---
  let groupMetadata = await conn.groupMetadata(m.chat);
  let realAdmins = groupMetadata.participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  let botID = conn.user.id.split(":")[0] + "@s.whatsapp.net";
  let realBotAdmin = realAdmins.includes(botID);

  // SI EL BOT DICE QUE NO ES ADMIN PERO QUIERES SABER POR QUÉ
  if (!isBotAdmin || !realBotAdmin) {

    let diagnostico = `
❗ *DIAGNÓSTICO ANTI-LINK* ❗

📌 *Bot detectó que NO es admin*, pero se verificó:

👤 *Usuario que envió el link:*
- ${sender}

🤖 *ID del bot detectado:*  
- ${botID}

👥 *Admins detectados por Baileys:*  
${realAdmins.map(a => "• " + a).join("\n")}

📌 *isBotAdmin que llega al handler:*  
- ${isBotAdmin}

📌 *isBotAdmin REAL comprobado desde metadata:*  
- ${realBotAdmin}

📌 *Mensaje detectado:*  
"${m.text}"

📌 *Link prohibido detectado:*  
- Sí (${isGroupLink})

⚠ *Conclusión:* Baileys cree que el bot *NO* es admin.
    `.trim();

    await conn.sendMessage(m.chat, { text: diagnostico });

    return;
  }

  // SI ES ADMIN ENTONCES ACTÚA
  const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
  if (m.text.includes(linkThisGroup)) return !0;

  await conn.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: bang,
      participant: delet
    }
  });

  await conn.groupParticipantsUpdate(m.chat, [sender], "remove");

  await conn.sendMessage(m.chat, {
    text: `🚫 Se eliminó a @${sender.split("@")[0]} por enviar un enlace prohibido.`,
    mentions: [sender]
  });

  return !0;
}
