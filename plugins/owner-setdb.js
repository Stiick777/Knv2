let handler = async (m, { conn }) => {
  try {
    if (!m.quoted) throw '⚠️ No estás respondiendo a ningún mensaje.'

    // Envia la estructura de m.quoted en formato JSON al chat
    const rawQuoted = JSON.stringify(m.quoted, null, 2)
    const rawMsg = JSON.stringify(m, null, 2)

    await conn.sendMessage(m.chat, {
      text: `📦 *Contenido de m.quoted:*\n\`\`\`${rawQuoted}\`\`\``,
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      text: `🧾 *Contenido completo del mensaje m:*\n\`\`\`${rawMsg}\`\`\``,
    }, { quoted: m })

  } catch (err) {
    await m.reply(`❌ Error: ${err}`)
  }
}

handler.help = ['setdbdebug']
handler.tags = ['owner']
handler.command = /^setdbdebug$/i
handler.rowner = true

export default handler
