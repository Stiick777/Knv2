import fetch from 'node-fetch'
import fs from 'fs'
import { exec } from 'child_process'

const handler = async (m,{conn,text}) => {

if(!text) return m.reply('Ingresa el nombre de la canción')

await m.react('🕓')

try {

const api = `https://api-faa.my.id/faa/ytplay?query=${encodeURIComponent(text)}`
const res = await fetch(api)
const json = await res.json()

if(!json.status) return m.reply('No se encontró resultado')

const {title,mp3,thumbnail,author,duration,views} = json.result

await conn.sendMessage(m.chat,{
image:{url:thumbnail},
caption:`🎵 *YouTube Play*

📀 ${title}
👤 ${author}
⏱ ${Math.floor(duration/60)}:${(duration%60).toString().padStart(2,'0')}
👁 ${views}

🚀 Procesando audio...`
},{quoted:m})

/* descargar audio correctamente */
const audioRes = await fetch(mp3,{
headers:{
'User-Agent':'Mozilla/5.0',
'Accept':'*/*',
'Connection':'keep-alive'
}
})

if(!audioRes.ok) throw 'Error descargando audio'

const buffer = await audioRes.buffer()

/* verificar tamaño */
if(buffer.length < 10000) throw 'Archivo inválido'

const input=`./${Date.now()}.m4a`
const output=`./${Date.now()}.mp3`

fs.writeFileSync(input,buffer)

/* convertir con ffmpeg */
await new Promise((resolve,reject)=>{
exec(`ffmpeg -y -i "${input}" -vn -ar 44100 -ac 2 -b:a 128k "${output}"`,
(err)=>{
if(err) reject(err)
else resolve()
})
})

const audio = fs.readFileSync(output)

await conn.sendMessage(m.chat,{
audio:audio,
mimetype:'audio/mpeg',
fileName:`${title}.mp3`
},{quoted:m})

fs.unlinkSync(input)
fs.unlinkSync(output)

await m.react('✔️')

}catch(e){

console.log(e)
m.reply('❌ Error descargando audio')

}

}

handler.help=['play']
handler.tags=['descargas']
handler.command=['play']

export default handler
