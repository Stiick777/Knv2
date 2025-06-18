let handler = async (m, { conn }) => {
  if (!m.quoted) {
    return m.reply('❌ Debes responder a un mensaje para obtener su LID y estructura.');
  }

  const citado = m.quoted;
  const targetJid = citado.sender || citado.participant || citado.key?.participant;
  const tipoID = targetJid?.endsWith('@lid') ? 'LID (oculto)' :
                 targetJid?.endsWith('@c.us') ? 'Número visible' :
                 targetJid?.endsWith('@s.whatsapp.net') ? 'Número normal' :
                 'Desconocido';

  const tipoMensaje = citado.mtype || 'Desconocido';
  const textoCitado = citado.text || '[No es un mensaje de texto]';

  // Extraer desde contextInfo
  let estructuraCitada = {};
  try {
    estructuraCitada = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || citado.message || {};
  } catch (e) {
    estructuraCitada = {};
  }

  // Detectar tipo adicional
  let tipoContenido = '🗒️ Texto';
  if (estructuraCitada.imageMessage) tipoContenido = '🖼️ Imagen';
  else if (estructuraCitada.stickerMessage) tipoContenido = '🔖 Sticker';
  else if (estructuraCitada.videoMessage) tipoContenido = '🎞️ Video';
  else if (estructuraCitada.audioMessage) tipoContenido = '🎧 Audio';
  else if (estructuraCitada.documentMessage) tipoContenido = '📄 Documento';
  else if (estructuraCitada.contactMessage) tipoContenido = '👤 Contacto';
  else if (estructuraCitada.buttonsMessage) tipoContenido = '📲 Botón';
  else if (estructuraCitada.listMessage) tipoContenido = '📋 Lista';

  const resumenEstructura = {
    key: citado.key || {},
    remoteJid: citado.key?.remoteJid || null,
    participant: citado.participant || null,
    message: estructuraCitada
  };

  let mensaje = `
📨 *Información del mensaje citado:*

👤 *Remitente:* \`${targetJid || 'No detectado'}\`
🔎 *Tipo de ID:* ${tipoID}
📦 *Tipo de mensaje:* ${tipoMensaje}
📝 *Contenido:* ${textoCitado}
📂 *Tipo de contenido detectado:* ${tipoContenido}

🧩 *Estructura del mensaje citado (resumen)*:
\`\`\`json
${JSON.stringify(resumenEstructura, null, 2).slice(0, 4000)}
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