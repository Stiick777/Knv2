let handler = async (m, { conn }) => {
  // Verificamos si se está respondiendo a un mensaje
  if (!m.quoted) {
    return m.reply('❌ Debes responder a un mensaje para obtener su LID o estructura.');
  }

  const citado = m.quoted;
  const targetJid = citado.sender || citado.participant;

  // Detecta el tipo de ID
  const tipoID = targetJid.endsWith('@lid') ? 'LID (oculto)' :
                 targetJid.endsWith('@c.us') ? 'Número visible' :
                 'Desconocido';

  // Armamos el mensaje de respuesta
  let mensaje = `
📨 *Información del mensaje citado:*

👤 *Remitente:* \`${targetJid}\`
🔎 *Tipo de ID:* ${tipoID}

🧩 *Estructura del mensaje citado (resumen)*:
\`\`\`json
${JSON.stringify({
  key: citado.key,
  message: citado.message,
  participant: citado.participant,
  remoteJid: citado.key?.remoteJid
}, null, 2).slice(0, 4000)}
\`\`\`
(Truncado si es muy largo)
  `.trim();

  // Enviamos el mensaje con mención si es posible
  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions: [targetJid]
  }, { quoted: m });
};

handler.command = ['lid'];
handler.group = true;
handler.rowner = true;
export default handler;