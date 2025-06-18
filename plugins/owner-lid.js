const handler = async (m, { conn, usedPrefix, command }) => {
  const citado = m.quoted;
  if (!citado) {
    return m.reply('❌ Debes responder a un mensaje para ver su estructura y LID.');
  }

  const { key = {}, message = {}, participant = null } = citado;
  const contenido = citado.text || citado.body || '[sin texto]';

  // Obtener JID del citado
  const jid = key.participant || citado.sender || m.chat || 'Desconocido';

  // Detectar tipo de ID
  let tipoID = 'Desconocido';
  if (jid.endsWith('@lid')) tipoID = '🟡 LID (oculto)';
  else if (jid.endsWith('@c.us')) tipoID = '🟢 Número visible';
  else if (jid.endsWith('@s.whatsapp.net')) tipoID = '🔵 Número normal';
  else tipoID = '🔴 Otro formato';

  // Preparar estructura compacta
  const resumen = {
    key,
    remoteJid: citado?.key?.remoteJid || null,
    participant: citado.participant || null,
    message: citado.message || {},
  };

  // Detectar tipo de mensaje
  const tipoMensaje = Object.keys(citado.message || {})[0] || 'desconocido';

  // Clasificar tipo de contenido
  const tipoContenido = (() => {
    if (citado.text) return '🗒️ Texto';
    if (citado.imageMessage) return '🖼️ Imagen';
    if (citado.videoMessage) return '🎞️ Video';
    if (citado.audioMessage) return '🎵 Audio';
    if (citado.documentMessage) return '📄 Documento';
    return '📦 Otro';
  })();

  let respuesta = `
📨 *Información del mensaje citado:*

👤 *Remitente:* \`${jid}\`
🔎 *Tipo de ID:* ${tipoID}
📦 *Tipo de mensaje:* ${tipoMensaje}
📝 *Contenido:* ${contenido}
📂 *Tipo de contenido detectado:* ${tipoContenido}

🧾 *JID detectado:* \`${jid}\`

🧩 *Estructura del mensaje citado (resumen)*:
\`\`\`json
${JSON.stringify(resumen, null, 2).slice(0, 1000)}${JSON.stringify(resumen).length > 1000 ? '\n... (truncado)' : ''}
\`\`\`
`.trim();

  await conn.reply(m.chat, respuesta, m);
};

handler.command = ['lid'];
handler.help = ['lid'];
handler.tags = ['debug'];
export default handler;