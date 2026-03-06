import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {

if (!text) return m.reply('*Ingresa el nombre de la canción*')
await m.react('🕓')

try {

const api = `https://api-faa.my.id/faa/ytplay?query=${encodeURIComponent(text)}`

const res = await fetch(api, {
headers: {
'User-Agent': 'Mozilla/5.0',
'Accept': 'application/json'
}
})

const data = await res.json()

if (!data.status) return m.reply('❌ No se encontraron resultados')

const { title, mp3, thumbnail, duration, views, author } = data.result

const minutos = Math.floor(duration / 60)
const segundos = (duration % 60).toString().padStart(2,'0')

const cap = `
🎵 *YouTube Play*
━━━━━━━━━━━━━━━
📀 *Título:* ${title}
👤 *Autor:* ${author}
⏱ *Duración:* ${minutos}:${segundos}
👁 *Vistas:* ${views.toLocaleString()}

🚀 Enviando audio...
`.trim()

// enviar info con miniatura
await conn.sendMessage(
m.chat,
{
image: { url: thumbnail },
caption: cap
},
{ quoted: m }
)

// descargar audio en buffer
const audioBuffer = await (await fetch(mp3, {
headers: {
'User-Agent': 'Mozilla/5.0'
}
})).buffer()

// enviar audio
await conn.sendMessage(
m.chat,
{
audio: audioBuffer,
mimetype: 'audio/mpeg',
fileName: `${title}.mp3`,
ptt: false
},
{ quoted: m }
)

await m.react('✔️')

} catch (error) {

console.error(error)

m.reply('⚠️ Error al descargar el audio')

}

}

handler.help = ['play <texto>']
handler.tags = ['descargas']
handler.command = ['play']

export default handler
