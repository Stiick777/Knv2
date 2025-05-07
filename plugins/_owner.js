const handler = async (m, { conn, usedPrefix, command }) => {
  const contextInfo = m.message?.extendedTextMessage?.contextInfo
  const mentioned = contextInfo?.mentionedJid || []

  console.log('===== DEBUG MENCIONES =====')
  console.log('Texto:', m.text)
  console.log('contextInfo:', contextInfo)
  console.log('mentionedJid:', mentioned)
  console.log('===========================')

  if (mentioned.length > 0) {
    await conn.reply(m.chat, `Mencionaste a: ${mentioned.join(', ')}`, m)
  } else {
    await conn.reply(m.chat, 'No detecté ninguna mención.', m)
  }
}

export default handler

handler.command = ['test']
handler.group = true
