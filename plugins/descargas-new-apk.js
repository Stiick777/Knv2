import { search, download } from 'aptoide-scraper'

var handler = async (m, {conn, usedPrefix, command, text}) => {
if (!text) return conn.reply(m.chat, '💥 *Ingrese el nombre de la apk para descargarlo.*', m, rcanal)
try {
await m.react('🕛')

let searchA = await search(text)
let data5 = await download(searchA[0].id)
let txt = `*DESCARGAS APK V2* \n\n`
txt += `🚀 *Nombre* : ${data5.name}\n`
txt += `🧩 *Package* : ${data5.package}\n`
txt += `🪴 *Update* : ${data5.lastup}\n`
txt += `⚖ *Peso* :  ${data5.size}`
await conn.sendFile(m.chat, data5.icon, 'thumbnail.jpg', txt, m, null, rcanal) 
await m.react('✅')  
if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
return await conn.reply(m.chat, '🛑 *El archivo es demaciado pesado*', m, )}
await conn.sendMessage(m.chat, {document: {url: data5.dllink}, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null}, {quoted: fkontak})
} catch {
    await m.react('❌')  
return conn.reply(m.chat, '✖️ *Ocurrió un fallo*', m,  )}}

handler.tags = ['descargas']
handler.help = ['apk2']
handler.command = ['apk2']
handler.group = true;

export default handler
