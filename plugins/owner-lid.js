let handler = async (m, { conn }) => {
  if (!m.quoted) {
    return m.reply('❌ Debes responder a un mensaje para obtener su LID y estructura.');
  }

  const citado = m.quoted;
  const context = m.message?.extendedTextMessage?.contextInfo || {};
  const qmsg = context.quotedMessage || citado.message || {};

  // Extraer JID desde el contexto si no aparece en key
  const remoteJid = citado.key?.remoteJid || context.remoteJid || m.chat || null;
  const participant = citado.key?.participant || context.participant || citado.sender || null;

  const tipoID = participant?.endsWith('@lid') ? 'LID (oculto)' :
                 participant?.endsWith('@c.us') ? 'Número visible' :
                 participant?.endsWith('@s.whatsapp.net') ? 'Número normal' :
                 'Desconocido';

  const tipoMensaje = citado.mtype || Object.keys(qmsg)[0] || 'Desconocido';
  const textoCitado = citado.text || qmsg?.[tipoMensaje]?.text || '[No es un mensaje de texto]';

  let tipoContenido = '🗒️ Texto';
  if (qmsg.imageMessage) tipoContenido = '🖼️ Imagen';
  else if (qmsg.stickerMessage) tipoContenido = '🔖 Sticker';
  else if (qmsg.videoMessage) tipoContenido = '🎞️ Video';
  else if (qmsg.audioMessage) tipoContenido = '🎧 Audio';
  else if (qmsg.documentMessage) tipoContenido = '📄 Documento';

  const resumen = {
    key: {
      remoteJid: remoteJid,
      fromMe: citado.key?.fromMe ?? null,
      id: citado.key?.id || context.stanzaId || null,
      participant: participant
    },
    remoteJid,
    participant,
    message: qmsg
  };

  const mensaje = `
📨 *Información del mensaje citado:*

👤 *Remitente:* \`${participant || 'Desconocido'}\`
🔎 *Tipo de ID:* ${tipoID}
📦 *Tipo de mensaje:* ${tipoMensaje}
📝 *Contenido:* ${textoCitado}
📂 *Tipo de contenido detectado:* ${tipoContenido}

🧩 *Estructura del mensaje citado (resumen)*:
\`\`\`json
${JSON.stringify(resumen, null, 2).slice(0, 4000)}
\`\`\`
(Truncado si es muy largo)
  `.trim();

  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions: participant ? [participant] : []
  }, { quoted: m });
};

handler.command = ['lid'];
handler.group = true;

export default handler;