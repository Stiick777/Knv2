import fetch from 'node-fetch'

export async function before(m, { conn }) {
let img = await (await fetch(`https://tinyurl.com/26dnmhay`)).buffer()

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

 global.adReply = {
	    contextInfo: { 
             forwardingScore: 9999, 
                 isForwarded: false, 
                    externalAdReply: {
				    showAdAttribution: true,
					title: botname,
					body: textbot,
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnailUrl: img,
                    thumbnail: img,
		           sourceUrl: canal,
		           mediaType: 1,
                   renderLargerThumbnail: true
				}
			}
		}
}