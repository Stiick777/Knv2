import fs from 'fs'

let handler = async (m) => {
  try {
    const path = './node_modules/@whiskeysockets/baileys/package.json'
    const pkg = JSON.parse(fs.readFileSync(path, 'utf8'))

    m.reply(`Nombre: ${pkg.name}
Versión: ${pkg.version}
Descripción: ${pkg.description || 'Sin descripción'}`)
  } catch (e) {
    m.reply(e.message)
  }
}

handler.command = ['infobaileys']
handler.owner = true

export default handler
