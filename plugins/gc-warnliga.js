let handler = async (m, { conn }) => {
  conn.ev.on('group-participants.update', async (json) => {
    console.log('EVENTO DETECTADO:')
    console.log(JSON.stringify(json, null, 2))
  })

  m.reply('Listener activado')
}

handler.command = ['testwelcome']
handler.owner = true

export default handler
