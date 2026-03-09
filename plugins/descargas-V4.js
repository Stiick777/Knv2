import fetch from "node-fetch";
import axios from "axios";
import yts from "yt-search";

let handler = async (m, { conn, text, command, args }) => {

if (command == 'playv2') {

if (!text) {
return conn.reply(m.chat, `*Ingresa el nombre de lo que quieres buscar*`, m);
}

await m.react('🕓');

const yt_play = await search(args.join(' '));

if (!yt_play || !yt_play[0]) {
return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
}

const duracionSegundos = yt_play[0].duration.seconds || 0;

if (duracionSegundos > 3600) {
return conn.reply(
m.chat,
`❌ *El video supera la duración máxima permitida de 1 hora.*\n\n📌 *Duración:* ${secondString(duracionSegundos)}`,
m
);
}

const texto1 = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊
===========================
> *𝚃𝚒𝚝𝚞𝚕𝚘* : ${yt_play[0].title}
> *𝙲𝚛𝚎𝚊𝚍𝚘* : ${yt_play[0].ago}
> *𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗* : ${secondString(duracionSegundos)}
*🚀 Se está descargando el video, espere...*
===========================
✰ KanBot ✰
> *Provided by Stiiven*
`.trim();

await conn.sendFile(m.chat, yt_play[0].thumbnail, 'thumb.jpg', texto1, m, null);

try {

const api = `https://api.delirius.store/download/ytmp4?url=${encodeURIComponent(yt_play[0].url)}`;
const res = await fetch(api);
const json = await res.json();

if (!json.status) throw new Error("API inválida");

let video = json.data.download;

let size = await getSize(video);

let MAX_SIZE = 104857600; //100MB

let cap = `😎 Su video by *_KanBot_*:

🎬 *Título:* ${json.data.title}
👤 *Autor:* ${json.data.author}
🌐 *URL:* ${json.data.url}
📦 *Peso:* ${await formatSize(size) || "Desconocido"}
`;

let buffer = await (await fetch(video)).buffer();

let options = {
quoted: m,
mimetype: 'video/mp4',
fileName: `${json.data.title}.mp4`,
caption: cap
};

if (size > MAX_SIZE) {

await conn.sendMessage(m.chat, {
document: buffer,
...options
});

} else {

await conn.sendFile(
m.chat,
buffer,
`${json.data.title}.mp4`,
cap,
m,
null,
{ mimetype: 'video/mp4' }
);

}

await m.react('✅');

} catch (error) {

console.error(error);

await m.react('❌');

await conn.reply(
m.chat,
`❌ *Ocurrió un error al intentar enviar el video.*\n\n📄 *Razón:* ${error.message}`,
m
);

}

}
};

handler.command = ['playv2'];
handler.help = ['playv2 <texto>'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;



async function search(query, options = {}) {
const search = await yts.search({query, hl: 'es', gl: 'ES', ...options});
return search.videos;
}



function secondString(seconds) {
seconds = Number(seconds);
const d = Math.floor(seconds / (3600 * 24));
const h = Math.floor((seconds % (3600 * 24)) / 3600);
const m = Math.floor((seconds % 3600) / 60);
const s = Math.floor(seconds % 60);
const dDisplay = d > 0 ? d + ' día, ' : '';
const hDisplay = h > 0 ? h + ' hora, ' : '';
const mDisplay = m > 0 ? m + ' minuto, ' : '';
const sDisplay = s > 0 ? s + ' segundos' : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
}



async function formatSize(bytes) {

const units = ['B','KB','MB','GB'];
let i = 0;

bytes = Number(bytes);

if (isNaN(bytes)) return "Desconocido";

while (bytes >= 1024 && i < units.length - 1) {
bytes /= 1024;
i++;
}

return `${bytes.toFixed(2)} ${units[i]}`;

}



async function getSize(url) {

try {

const response = await axios.head(url);
const contentLength = response.headers['content-length'];

return contentLength ? parseInt(contentLength, 10) : null;

} catch {

return null;

}

}
