import fetch from 'node-fetch';

let handler = async (m, { conn: star, args }) => {

if (!args?.[0])
return star.reply(
m.chat,
'💣 _*Ingresa el enlace del video de YouTube junto al comando.*_\n\n`Ejemplo:`\n> *!ytmp4doc* https://youtube.com/watch?v=qHDJSRlNhVs',
m,
rcanal
);

if (!args[0].match(/youtu/gi))
return star.reply(
m.chat,
'❌ Verifica que el enlace sea de YouTube.',
m,
rcanal
).then(() => m.react('✖️'));

await m.react('🕓');

try {

const url = args[0];

let title;
let quality;
let download_url;
let servidor;

// ==================================
// API PRINCIPAL: DELIRIUS
// ==================================
try {

const apiUrl = `https://api.delirius.store/download/ytmp4?url=${encodeURIComponent(url)}&format=360p`;

const res = await fetch(apiUrl);
const json = await res.json();

if (!json?.status || !json?.data?.download) {
throw new Error('Delirius inválida');
}

title = json.data.title || 'video';
quality = json.data.format || '360p';
download_url = json.data.download;
servidor = 'Delirius';

} catch (e) {

console.log('Delirius falló, usando ZennzXD...');

// ==================================
// API RESPALDO: ZENNZXD
// ==================================
const apiUrl = `https://api.zenzxz.my.id/download/youtube?url=${encodeURIComponent(url)}&format=360`;

const res = await fetch(apiUrl);
const json = await res.json();

if (!json?.status || !json?.result?.download) {
throw new Error('ZennzXD inválida');
}

title = json.result.title || 'video';
quality = `${json.result.format}p`;
download_url = json.result.download;
servidor = 'ZennzXD';

}

// ==================================
// MENSAJE DE ESPERA
// ==================================
let txt = '`🅓🅞🅒🅢 🅥➋ - 🅚🅐🅝🅑🅞🅣`\n\n';
txt += `🍁 *Título:* ${title}\n`;
txt += `🎞️ *Calidad:* ${quality}\n`;
txt += `🌐 *Servidor:* ${servidor}\n\n`;
txt += `> *Se está enviando su video, por favor espere*`;

await star.reply(m.chat, txt, m);

// ==================================
// ENVIAR COMO DOCUMENTO
// ==================================
await star.sendMessage(
m.chat,
{
document: {
url: download_url
},
mimetype: 'video/mp4',
fileName: `${title}.mp4`,
caption: '🌝 *Provided by KanBot* 🌚'
},
{
quoted: m
}
);

await m.react('✅');

} catch (e) {

console.error('Error descarga:', e);

await m.react('✖️');

return star.reply(
m.chat,
'❌ _*No se pudo descargar el video desde ningún servidor.*_',
m,
rcanal
);

}
};

handler.help = ['ytmp4doc <link yt>'];
handler.tags = ['descargas'];
handler.command = ['ytmp4doc', 'yt4doc'];
handler.group = true;

export default handler;
