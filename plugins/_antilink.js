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

  // No hay anti-link o no contiene un link → salir
  if (!chat.antiLink || !isGroupLink) return !0;

  // Enlaces permitidos → ignorar
  if (allowedLinks.some(link => m.text.includes(link))) return !0;

  // Administradores NO reciben sanción
  if (isAdmin) return !0;

  // ==========================================================
  //        🔍   VERIFICACIÓN REAL DEL ADMIN DEL BOT
  // ==========================================================

  let groupMetadata = await conn.groupMetadata(m.chat);
  let realAdmins = groupMetadata.participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  // Crear ambos posibles JIDs del bot
  let baseID = conn.user.id.split(":")[0];
  let botJidClassic = baseID + "@s.whatsapp.net";
  let botJidLid = baseID + "@lid";

  // Verificar admin real (ambos tipos de JID)
  let realBotAdmin = realAdmins.includes(botJidClassic) || realAdmins.includes(botJidLid);

  // ==========================================================
  //          🛑  SI EL BOT PIENSA QUE NO ES ADMIN
  // ==========================================================

  if (!realBotAdmin) {
    let diagnostico = `
❗ *DIAGNÓSTICO ANTI-LINK* ❗

⚠ El bot cree que *NO es admin*. Se verifica:

👤 *Usuario que envió el link:*
- ${sender}

🤖 *JID detectado del bot:*  
• ${botJidClassic}  
• ${botJidLid}

👥 *Admins detectados por Baileys:*  
${realAdmins.map(a => "• " + a).join("\n")}

📌 *isBotAdmin recibido:*  
- ${isBotAdmin}

📌 *isBotAdmin REAL:*  
- ${realBotAdmin}

📌 *Mensaje detectado:*  
"${m.text}"

📌 *Link prohibido detectado:*  
- Sí

⚠ *BAILEYS NO MUESTRA AL BOT COMO ADMIN EN ESTE GRUPO.*
    `.trim();

    await conn.sendMessage(m.chat, { text: diagnostico });
    return !0;
  }

  // ==========================================================
  //                🟢  SI EL BOT ES ADMIN
  // ==========================================================

  // Ignorar si es link del mismo grupo
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

  // Expulsar usuario
  await conn.groupParticipantsUpdate(m.chat, [sender], "remove");

  // Aviso final
  await conn.sendMessage(m.chat, {
    text: `🚫 Se eliminó a @${sender.split("@")[0]} por enviar un enlace prohibido.`,
    mentions: [sender]
  });

  return !0;
}
