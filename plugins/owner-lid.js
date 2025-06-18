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

  // reconstruimos estructura parcial
  const resumenEstructura = {
    key: citado.key,
    message: citado.message,
    participant: citado.participant,
    remoteJid: citado.key?.remoteJid,
  };

  let mensaje = `
📨 *Información del mensaje citado:*

👤 *Remitente:* \`${targetJid || 'No detectado'}\`
🔎 *Tipo de ID:* ${tipoID}
📦 *Tipo de mensaje:* ${tipoMensaje}
📝 *Contenido:* ${textoCitado}

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
handler.rowner = true
export default handler;