let handler = async (m, { conn }) => {
  m.reply(
    'Propiedades:\n\n' +
    Object.keys(conn)
      .sort()
      .join('\n')
  )
}

handler.command = ['conninfo']
handler.owner = true

export default handler
