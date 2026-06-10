import fs from 'fs'

let handler = async (m) => {
  try {
    const path = './node_modules/@whiskeysockets/baileys/package.json'

    const pkg = JSON.parse(fs.readFileSync(path, 'utf8'))

    m.reply(`Versión instalada: ${pkg.version}`)
  } catch (e) {
    m.reply(`Error:\n${e.message}`)
  }
}

handler.command = ['baileys']
handler.owner = true

export default handler
