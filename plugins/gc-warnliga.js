let handler = async (m, { conn }) => {
  let version = 'Desconocida'

  if (conn?.ws?.version) {
    version = conn.ws.version.join('.')
  }

  await m.reply(`Versión de Baileys: ${version}`)
}

handler.command = ['baileys']
handler.owner = true

export default handler
