import fs from 'fs'

const db = JSON.parse(fs.readFileSync('./src/database/database.json'))

let handler = async (m, { args }) => {
let user = global.db.data.users[m.sender]
if (!args[0]) return m.reply('🚩 Ingresa la cantidad de *⭐ Estrellas* que deseas Retirar.', m, rcanal)
if (args[0] == 'all') {
let count = parseInt(user.bank)
user.bank -= count * 1
user.estrellas += count * 1
await m.reply(`🚩 Retiraste *${count} ⭐ Estrellas* del Banco.`, m, rcanal)
return !0
}
if (!Number(args[0])) return m.reply('🚩 La cantidad deve ser un Numero.', m, rcanal)
let count = parseInt(args[0])
if (!user.bank) return m.reply('No tienes *⭐ Estrellas* en el Banco.', m, rcanal)
if (user.bank < count) return m.reply(`Solo tienes *${user.bank} ⭐ Estrellas* en el Banco.`, m, rcanal)
user.bank -= count * 1
user.estrellas += count * 1
await m.reply(`🚩 Retiraste *${count} ⭐ Estrellas* del Banco.`, m, rcanal)}

handler.help = ['retirar']
handler.tags = ['rpg']
handler.command = ['withdraw', 'retirar', 'wd']
handler.group = true;
export default handler
