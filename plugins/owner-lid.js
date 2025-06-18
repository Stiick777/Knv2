let handler = async (m, { conn }) => {
  if (!m.quoted) {
    return m.reply('❌ Debes responder a un mensaje para obtener su LID y estructura.');
  }

  const citado = m.quoted;
  const context = m.message?.extendedTextMessage?.contextInfo || {};

  const keyData = citado.key || context.stanzaId ? {
    remoteJid: citado.key?.remoteJid || context.remoteJid || null,
    fromMe: citado.key?.fromMe ?? null,
    id: citado.key?.id || context.stanzaId || null,
    participant: citado.key?.participant || context.participant || null,
  } : {};

  const targetJid = keyData.participant || citado.sender || context.participant;
  const tipoID = targetJid?.endsWith('@lid') ? 'LID (oculto)' :
                 targetJid?.endsWith('@c.us') ? 'Número visible' :
                 targetJid?.endsWith('@s.whatsapp.net') ? 'Número normal' :
                 'Desconocido';

  const tipoMensaje = citado.mtype || 'Desconocido';
  const textoCitado = citado.text || '[No es un mensaje de texto]';

  // Detectar tipo de contenido
  const estructuraCitada = context.quotedMessage || citado.message || {};
  let tipoContenido = '🗒️ Texto';
  if (estructuraCitada.imageMessage) tipoContenido = '🖼️ Imagen';
  else if (estructuraCitada.stickerMessage) tipoContenido = '🔖 Sticker';
  else if (estructuraCitada.videoMessage) tipoContenido = '🎞️ Video';
  else if (estructuraCitada.audioMessage) tipoContenido = '🎧 Audio';
  else if (estructuraCitada.documentMessage) tipoContenido = '📄 Documento';
  else if (estructuraCitada.contactMessage) tipoContenido = '👤 Contacto';
  else if (estructuraCitada.buttonsMessage) tipoContenido = '📲 Botón';
  else if (estructuraCitada.listMessage) tipoContenido = '📋 Lista';

  // Preparar estructura de resumen
  const resumen = {
    key: keyData,
    remoteJid: keyData.remoteJid || null,
    participant: keyData.participant || null,
    message: estructuraCitada
  };

  const mensaje = `
📨 *Información del mensaje citado:*

👤 *Remitente:* \`${targetJid || 'No detectado'}\`
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
    mentions: targetJid ? [targetJid] : []
  }, { quoted: m });
};

handler.command = ['lid'];
handler.group = true;

export default handler;