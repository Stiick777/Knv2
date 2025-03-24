import fetch from 'node-fetch';

const handler = async (m, { conn, participants, groupMetadata }) => {
  let ppUrl = await conn.profilePictureUrl(m.chat, 'image').catch((_) => null) || `${global.icons}`;

  let ppBuffer;
  try {
    const res = await fetch(ppUrl);
    if (!res.ok) throw new Error('Error al descargar la imagen');
    ppBuffer = await res.buffer();
  } catch (err) {
    console.error('Error obteniendo la imagen de perfil:', err);
    ppBuffer = null;
  }

  const { antiToxic, reaction, antiTraba, antidelete, antiviewonce, welcome, detect, antiLink, antiLink2, modohorny, autosticker, audios } = global.db.data.chats[m.chat];

  const groupAdmins = participants.filter((p) => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
  const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';

  const text = `💥 *INFO GRUPO*  
💌 *ID:*  
→ ${groupMetadata.id}  
🥷 *Nombre:*  
→ ${groupMetadata.subject}  
🌟 *Descripción:*  
→ Leelo puta (￣へ ￣ 凸  
💫 *Miembros:*  
→ ${participants.length} Participantes  
👑 *Creador del Grupo:*  
→ @${owner.split('@')[0]}  
🏆 *Administradores:*  
${listAdmin}  

💭 *CONFIGURACIÓN*  

◈ *Welcome:* ${welcome ? '✅' : '❌'}  
◈ *Detect:* ${detect ? '✅' : '❌'}    
◈ *Antilink:* ${antiLink ? '✅' : '❌'}   
◈ *Antilink 𝟸:* ${antiLink2 ? '✅' : '❌'}   
◈ *Modohorny:* ${modohorny ? '✅' : '❌'}   
◈ *Autosticker:* ${autosticker ? '✅' : '❌'}   
◈ *Audios:* ${audios ? '✅' : '❌'}   
◈ *Antiver:* ${antiviewonce ? '✅' : '❌'}   
◈ *Reacción* ${reaction ? "✅️" : "❌️"}  
◈ *Delete:* ${antidelete ? '✅' : '❌'}   
◈ *Antitoxic:* ${antiToxic ? '✅' : '❌'}   
◈ *Antitraba:* ${antiTraba ? '✅' : '❌'}   
`.trim();

  if (ppBuffer) {
    await conn.sendFile(m.chat, ppBuffer, 'img.jpg', text, m, false, { mentions: [...groupAdmins.map((v) => v.id), owner] });
  } else {
    await conn.sendMessage(m.chat, { text, mentions: [...groupAdmins.map((v) => v.id), owner] });
  }
};

handler.help = ['infogrupo'];
handler.tags = ['grupo'];
handler.command = ['infogrupo', 'infgp'];
handler.group = true;

export default handler;
