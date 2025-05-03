import fs from 'fs'

const db = JSON.parse(fs.readFileSync('./src/database/database.json'))

let handler = async (m, { args }) => {
  let user = global.db.data.users[m.sender]
  
  if (!args[0]) return m.reply('🚩 Ingresa la cantidad de *⭐ Estrellas* que deseas depositar.')
  
  if (args[0] == 'all') {
    let count = parseInt(user.estrellas)
    if (!count || count < 1) return m.reply('🚩 No tienes *⭐ Estrellas* para depositar.')
    user.estrellas -= count
    user.bank += count
    await m.reply(`Depositaste *${count} ⭐ Estrellas* al Banco.`)
    return
  }

  let count = parseInt(args[0])
  if (isNaN(count) || count < 1) return m.reply('🚩 Ingresa una cantidad válida de *⭐ Estrellas*.')
  if (!user.estrellas || user.estrellas < count) return m.reply(`Solo tienes *${user.estrellas || 0} ⭐ Estrellas* en la Cartera.`)

  user.estrellas -= count
  user.bank += count
  await m.reply(`Depositaste *${count} ⭐ Estrellas* al Banco.`)
}

handler.help = ['depositar']
handler.tags = ['rpg']
handler.command = ['deposit', 'depositar', 'dep', 'd']
handler.group = true

export default handler
