import fetch from 'node-fetch';

const handler = async (m, { conn, participants = [], groupMetadata = {} }) => {
  let ppUrl = await conn.profilePictureUrl(m.chat, 'image').catch(() => null) || global.icons;

  let ppBuffer = null;
  try {
    const res = await fetch(ppUrl);
    if (res.ok) ppBuffer = await res.buffer();
  } catch (e) {
    console.error('Error obteniendo foto del grupo:', e);
  }

  const chat = global.db.data.chats[m.chat] || {};

  const {
    antiToxic = false,
    reaction = false,
    antiTraba = false,
    antidelete = false,
    antiviewonce = false,
    welcome = false,
    detect = false,
    antiLink = false,
    antiLink2 = false,
    modohorny = false,
    autosticker = false,
    audios = false
  } = chat;

  const groupAdmins = participants.filter(p => p?.admin);

  const listAdmin = groupAdmins.length
    ? groupAdmins.map((v, i) => {
        const jid = v?.id || v?.jid || v?.phoneNumber || '';
        return `${i + 1}. @${jid.split('@')[0]}`;
      }).join('\n')
    : 'Sin administradores detectados';

  const owner =
    groupMetadata?.owner ||
    groupAdmins.find(p => p?.admin === 'superadmin')?.id ||
    groupAdmins.find(p => p?.admin === 'superadmin')?.jid ||
    `${m.chat.split('-')[0]}@s.whatsapp.net`;

  const ownerNumber = (owner || '').split('@')[0];

  const text = `
💥 *INFO GRUPO*

💌 *ID:*
→ ${groupMetadata?.id || m.chat}

🥷 *Nombre:*
→ ${groupMetadata?.subject || 'Sin nombre'}

🌟 *Descripción:*
→ ${groupMetadata?.desc || 'Sin descripción'}

💫 *Miembros:*
→ ${participants.length} Participantes

👑 *Creador del Grupo:*
→ @${ownerNumber}

🏆 *Administradores:*
${listAdmin}

💭 *CONFIGURACIÓN*

◈ *Welcome:* ${welcome ? '✅' : '❌'}
◈ *Detect:* ${detect ? '✅' : '❌'}
◈ *Antilink:* ${antiLink ? '✅' : '❌'}
◈ *Antilink 2:* ${antiLink2 ? '✅' : '❌'}
◈ *Modohorny:* ${modohorny ? '✅' : '❌'}
◈ *Autosticker:* ${autosticker ? '✅' : '❌'}
◈ *Audios:* ${audios ? '✅' : '❌'}
◈ *Antiver:* ${antiviewonce ? '✅' : '❌'}
◈ *Reacción:* ${reaction ? '✅' : '❌'}
◈ *Delete:* ${antidelete ? '✅' : '❌'}
◈ *Antitoxic:* ${antiToxic ? '✅' : '❌'}
◈ *Antitraba:* ${antiTraba ? '✅' : '❌'}
`.trim();

  const mentions = [
    ...groupAdmins
      .map(v => v?.id || v?.jid || v?.phoneNumber)
      .filter(Boolean),
    owner
  ];

  if (ppBuffer) {
    await conn.sendFile(
      m.chat,
      ppBuffer,
      'infogrupo.jpg',
      text,
      m,
      false,
      { mentions }
    );
  } else {
    await conn.sendMessage(
      m.chat,
      {
        text,
        mentions
      },
      { quoted: m }
    );
  }
};

handler.help = ['infogrupo'];
handler.tags = ['grupo'];
handler.command = ['infogrupo', 'infgp'];
handler.group = true;

export default handler;
