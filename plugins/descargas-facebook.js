import axios from "axios";
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";

const handler = async (m, { conn, args }) => {

if (!args[0]) {
return conn.reply(
m.chat,
"🎈 *Ingresa un link de Facebook*",
m
)
}

const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/i

if (!facebookRegex.test(args[0])) {
return conn.reply(
m.chat,
"❌ *El enlace proporcionado no es válido.*",
m
)
}

await m.react("⏳")

let result

// =====================================
// ⭐ API ALYACORE FACEBOOK
// =====================================
try {

const api = `https://api.alyacore.xyz/dl/facebook?url=${encodeURIComponent(args[0])}&key=Alya-7IlWb4gp`

const response = await fetch(api)
const json = await response.json()

if (!json.status || !json.resultados?.length) {
throw new Error("No se encontraron enlaces")
}

// Prioridad calidad
let video =
json.resultados.find(v =>
v.quality?.includes("720p") &&
v.url &&
v.url !== "/"
) ||

json.resultados.find(v =>
v.quality?.includes("840p") &&
v.url &&
v.url !== "/"
) ||

json.resultados.find(v =>
v.quality?.includes("360p") &&
v.url &&
v.url !== "/"
) ||

json.resultados.find(v =>
v.url &&
v.url !== "/"
)

if (!video?.url) {
throw new Error("Sin URL válida")
}

result = {
title: "Facebook Video",
videoUrl: video.url,
quality: video.quality
}

} catch (err) {
console.error("❌ Error API:", err.message)
await m.react("❌")
return conn.reply(
m.chat,
"❎ *No se pudo obtener el video de Facebook.*",
m
)
}

// =====================================
// 📥 DESCARGAR Y ENVIAR
// =====================================
try {

await m.react("📥")

const { data } = await axios.get(
result.videoUrl,
{
responseType: "arraybuffer",
headers: {
"User-Agent": "Mozilla/5.0"
}
}
)

const buffer = Buffer.from(data)
const type = await fileTypeFromBuffer(buffer)

await conn.sendMessage(
m.chat,
{
video: buffer,
mimetype: type?.mime || "video/mp4",
fileName: "facebook.mp4",
caption:
`🎥 *Facebook Video*
📺 Calidad: ${result.quality}
✨ *_By KanBot_*`
},
{ quoted: m }
)

await m.react("✅")

} catch (err) {

console.error("❌ Error al enviar:", err.message)

await m.react("❌")

return conn.reply(
m.chat,
"❌ *Error al enviar el video. Intenta nuevamente.*",
m
)

}

}

handler.help = ["facebook <url>", "fb <url>"]
handler.tags = ["descargas"]
handler.command = ["facebook", "fb"]
handler.group = true

export default handler
