import fetch from 'node-fetch'

export async function before(m, { conn }) {
let img = await (await fetch(`https://files.catbox.moe/mt2cl8.jpg`)).buffer()

  const canales = [
    {
      id: "120363318891913110@newsletter",
      nombre: "✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰",
    },
    {
      id: "120363318891913110@newsletter",
      nombre: "✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰",
    },
  ]

  const canalSeleccionado = canales[Math.floor(Math.random() * canales.length)]

  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: canalSeleccionado.id,
        serverMessageId: 100,
        newsletterName: canalSeleccionado.nombre,
      },
    },
  }

}
