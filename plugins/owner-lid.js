let handler = async (m, { conn }) => {
  if (!m.quoted) {
    return m.reply('❌ Debes responder a un mensaje para obtener su LID y estructura.');
  }

  const citado = m.quoted;
  const json = citado.toJSON(); // estructura completa del mensaje citado
  const targetJid = citado.sender || citado.participant || citado.key?.participant;

  const tipoID = targetJid?.endsWith('@lid') ? 'LID (oculto)' :
                 targetJid?.endsWith('@c.us') ? 'Número visible' :
                 targetJid?.endsWith('@s.whatsapp.net') ? 'Número normal' :
                 'Desconocido';

  // Tipo de mensaje (ej. conversation, imageMessage, etc.)
  const tipoMensaje = citado.mtype || 'Desconocido';

  // Texto del mensaje si existe
  const textoCitado = citado.text || '[No es un mensaje de texto]';

  let mensaje = `
📨 *Información del mensaje citado:*

👤 *Remitente:* \`${targetJid || 'No detectado'}\`
🔎 *Tipo de ID:* ${tipoID}
📦 *Tipo de mensaje:* ${tipoMensaje}
📝 *Contenido:* ${textoCitado}

🧩 *Estructura JSON del mensaje citado:*
\`\`\`json
${JSON.stringify(json, null, 2).slice(0, 4000)}
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
handler.rwoner = true 
export default handler;