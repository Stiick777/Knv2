
let handler = async (m, { conn}) => {

let name = conn.getName(m.sender)

conn.sendButton(m.chat, `Hola! *${name}*\n`,  null, [
      ['⦙☰ Menu', '/mkan'],
      ['⧳ Estado', '/status'],
      [`⌬ Grupos`, '/ofcc']
    ], m) 
} 

handler.customPrefix = /^(bot|senna)$/i
handler.command = new RegExp

export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
