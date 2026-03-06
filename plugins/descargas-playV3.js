import fetch from 'node-fetch'
import fs from 'fs'
import { exec } from 'child_process'

const handler = async (m, { conn, text }) => {

if (!text) return m.reply('*Ingresa el nombre de la canción*')
await m.react('🕓')

try {

const api = `https://api-faa.my.id/faa/ytplay?query=${encodeURIComponent(text)}`

const res = await fetch(api, {
headers: { 'User-Agent': 'Mozilla/5.0' }
})

const data = await res.json()

if (!data.status) return m.reply('❌ No se encontraron resultados')

const { title, mp3, thumbnail, duration, views, author } = data.result

const cap = `
🎵 *YouTube Play*
━━━━━━━━━━━━━━━
📀 *Título:* ${title}
👤 *Autor:* ${author}
⏱ *Duración:* ${Math.floor(duration/60)}:${(duration%60).toString().padStart(2,'0')}
👁 *Vistas:* ${views.toLocaleString()}

🚀 Procesando audio...
`.trim()

await conn.sendMessage(m.chat,{
image:{ url: thumbnail },
caption: cap
},{ quoted:m })

// descargar audio
const buffer = await (await fetch(mp3,{
headers:{ 'User-Agent':'Mozilla/5.0'}
})).buffer()

const input = `./audio_${Date.now()}.tmp`
const output = `./audio_${Date.now()}.mp3`

fs.writeFileSync(input, buffer)

// convertir correctamente
await new Promise((resolve,reject)=>{
exec(`ffmpeg -y -loglevel error -i "${input}" -vn -acodec libmp3lame -ab 128k "${output}"`,
(err)=>{
if(err) reject(err)
else resolve()
})
})

const finalAudio = fs.readFileSync(output)

await conn.sendMessage(
m.chat,
{
audio: finalAudio,
mimetype:'audio/mpeg',
fileName:`${title}.mp3`,
ptt:false
},
{ quoted:m }
)

fs.unlinkSync(input)
fs.unlinkSync(output)

await m.react('✔️')

}catch(e){

console.error(e)
m.reply('⚠️ Error procesando el audio')

}

}

handler.help = ['play <texto>']
handler.tags = ['descargas']
handler.command = ['play']

export default handler
