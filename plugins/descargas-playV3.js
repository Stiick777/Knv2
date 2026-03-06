import fetch from 'node-fetch'
import fs from 'fs'
import { exec } from 'child_process'

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

🚀 Procesando audio...
`.trim()

// enviar miniatura
await conn.sendMessage(
m.chat,
{
image: { url: thumbnail },
caption: cap
},
{ quoted: m }
)

// descargar audio
const audioBuffer = await (await fetch(mp3)).buffer()

const input = `./tmp_${Date.now()}.mp3`
const output = `./tmp_${Date.now()}_fix.mp3`

fs.writeFileSync(input, audioBuffer)

// convertir con ffmpeg
await new Promise((resolve, reject) => {
exec(`ffmpeg -y -i "${input}" -vn -ar 44100 -ac 2 -b:a 192k "${output}"`,
(err) => {
if (err) reject(err)
else resolve()
})
})

// leer audio convertido
const finalAudio = fs.readFileSync(output)

// enviar audio
await conn.sendMessage(
m.chat,
{
audio: finalAudio,
mimetype: 'audio/mpeg',
fileName: `${title}.mp3`,
ptt: false
},
{ quoted: m }
)

// eliminar archivos temporales
fs.unlinkSync(input)
fs.unlinkSync(output)

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
