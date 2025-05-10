import fs from 'fs'

const db = JSON.parse(fs.readFileSync('./src/database/database.json'))

let handler = async (m, { args }) => {
  let user = global.db.data.users[m.sender]

  // Validar que se haya ingresado un argumento
  if (!args[0]) {
    await m.reply('🚩 Ingresa la cantidad de *⭐ Estrellas* que deseas Retirar.')
    return
  }

  // Si el argumento es "all", retirar todo del banco
  if (args[0].toLowerCase() === 'all') {
    let count = parseInt(user.bank)
    if (!count || count <= 0) {
      await m.reply('🚩 No tienes *⭐ Estrellas* en el Banco.')
      return
    }
    user.bank -= count
    user.estrellas += count
    await m.reply(`🚩 Retiraste *${count} ⭐ Estrellas* del Banco.`)
    return
  }

  // Validar que el argumento sea un número
  if (isNaN(args[0])) {
    await m.reply('🚩 La cantidad debe ser un número.')
    return
  }

  let count = parseInt(args[0])

  if (!user.bank || user.bank <= 0) {
    await m.reply('🚩 No tienes *⭐ Estrellas* en el Banco.')
    return
  }

  if (user.bank < count) {
    await m.reply(`🚩 Solo tienes *${user.bank} ⭐ Estrellas* en el Banco.`)
    return
  }

  user.bank -= count
  user.estrellas += count
  await m.reply(`🚩 Retiraste *${count} ⭐ Estrellas* del Banco.`)
}

handler.help = ['retirar']
handler.tags = ['rpg']
handler.command = ['withdraw', 'retirar', 'wd']
handler.group = true

export default handler
