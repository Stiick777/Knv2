import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios'
import fs from 'fs'
import { execSync } from 'child_process'
const LimitAud = 725 * 1024 * 1024; //700MB
const LimitVid = 425 * 1024 * 1024; //425MB
const handler = async (m, {conn, command, args, text, usedPrefix}) => {

if (command == 'play') {
  if (!text) return conn.reply(m.chat, `*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*`, m, rcanal);
  await m.react('🕓');

  const yt_play = await search(args.join(' '));
  const texto1 = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜
===========================

> *𝚃𝚒𝚝𝚞𝚕𝚘* :  ${yt_play[0].title}

> *𝙲𝚛𝚎𝚊𝚍𝚘* :  ${yt_play[0].ago}

> *𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗* :  ${secondString(yt_play[0].duration.seconds)}

*🚀 𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝘼𝙐𝘿𝙄𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊*

===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> *Provided by Stiiven

`.trim();

  await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m, null, rcanal);

try {
    await m.react('🕓'); // Reaccionar con un ícono de reloj mientras procesa

    // Construir URL de la API con el enlace del video
    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(yt_play[0].url)}`;
    const apiResponse = await fetch(apiUrl);
    const responseData = await apiResponse.json();

    // Verificar si la API devolvió un resultado válido
    if (!responseData.success || !responseData.result || !responseData.result.download_url) {
        await m.react('❌');
        return await conn.sendMessage(m.chat, 'No se pudo procesar el video. Intenta con otro enlace.', { quoted: m });
    }

    // Enviar el audio directamente al chat sin almacenarlo ni convertirlo
    await conn.sendMessage(m.chat, {
        audio: { url: responseData.result.download_url },
        mimetype: 'audio/mpeg',
        fileName: `${responseData.result.title}.mp3`,
        ptt: false,
    }, { quoted: m });

    await m.react('✅'); // Reaccionar con éxito
} catch (error) {
//
try {
    await m.react('🕓'); // Reaccionar con un ícono de reloj mientras procesa

    // Construir URL de la API con el enlace del video
    const apiUrl = `https://api.agungny.my.id/api/youtube-audio?url=${encodeURIComponent(yt_play[0].url)}`;
    const apiResponse = await fetch(apiUrl);
    const responseData = await apiResponse.json();

    // Verificar si la API devolvió un resultado válido
    if (!responseData.status || !responseData.result || !responseData.result.downloadUrl) {
        await m.react('❌');
        return await conn.sendMessage(m.chat, 'No se pudo procesar el video. Intenta con otro enlace.', { quoted: m });
    }

    // Enviar el audio directamente al chat sin almacenarlo ni convertirlo
    await conn.sendMessage(m.chat, {
        audio: { url: responseData.result.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${responseData.result.title}.mp3`,
        ptt: false,
    }, { quoted: m });

    await m.react('✅'); // Reaccionar con éxito
} catch (error1) {
    await m.react('❌'); // Reaccionar con error
    console.error(error);
    await conn.sendMessage(m.chat, 'Ocurrió un error al procesar el enlace.', { quoted: m });
}
}

}

if (command == 'play2') {
    if (!text) return conn.reply(m.chat, `*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*`, m, rcanal);
    
    await m.react('🕓'); 

    const yt_play = await search(args.join(' '));
    const texto1 = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜
===========================

> *𝚃𝚒𝚝𝚞𝚕𝚘* :  ${yt_play[0].title}

> *𝙲𝚛𝚎𝚊𝚍𝚘* :  ${yt_play[0].ago}

> *𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗* :  ${secondString(yt_play[0].duration.seconds)}

*🚀 𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊*

===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> *Provided by Stiiven
`.trim();

    await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m, null, rcanal);


try {
    await m.react('🕓'); // Reaccionar con un ícono de reloj mientras procesa

    // Construir la URL de la API con el enlace del video
    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yt_play[0].url)}`;
    const apiResponse = await fetch(apiUrl);
    const response = await apiResponse.json();

    // Verificar si la API devolvió un resultado válido
    if (!response.success || !response.result || !response.result.download_url) {
        await m.react('❌'); // Reaccionar con un ícono de error
        return await conn.sendMessage(m.chat, 'No se pudo procesar el video. Intenta con otro enlace.', { quoted: m });
    }

    // Extraer datos de la respuesta de la API
    const { download_url: downloadUrl, title } = response.result;

    // Enviar el video al chat
    await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        caption: `🎥 *${title}*\n😎 Su video by ✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰`,
        mimetype: 'video/mp4',
    }, { quoted: m });

    await m.react('✅'); // Reaccionar con un ícono de éxito
} catch (error) {
    await m.react('❌'); // Reaccionar con un ícono de error en caso de fallo
    console.error(error); // Para poder depurar el error si es necesario
}
    
}


}
handler.help = ['play', 'play2'];
handler.tags = ['descargas'];
handler.command = ['play2', 'play']
//handler.yenes = 3
handler.group = true;
export default handler;

async function search(query, options = {}) {
const search = await yts.search({query, hl: 'es', gl: 'ES', ...options});
return search.videos;
}

function MilesNumber(number) {
const exp = /(\d)(?=(\d{3})+(?!\d))/g;
const rep = '$1.';
const arr = number.toString().split('.');
arr[0] = arr[0].replace(exp, rep);
return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
seconds = Number(seconds);
const d = Math.floor(seconds / (3600 * 24));
const h = Math.floor((seconds % (3600 * 24)) / 3600);
const m = Math.floor((seconds % 3600) / 60);
const s = Math.floor(seconds % 60);
const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
  }

const getBuffer = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error("Error al obtener el buffer", error);
    throw new Error("Error al obtener el buffer");
  }
}

async function getFileSize(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentLength = response.headers.get('content-length');
        return contentLength ? parseInt(contentLength, 10) : 0;
    } catch (error) {
        console.error("Error al obtener el tamaño del archivo", error);
        return 0;
    }
}

async function fetchY2mate(url) {
  const baseUrl = 'https://www.y2mate.com/mates/en60';
  const videoInfo = await fetch(`${baseUrl}/analyze/ajax`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ url, q_auto: 0 })
  }).then(res => res.json());

  const id = videoInfo.result.id;
  const downloadInfo = await fetch(`${baseUrl}/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ type: 'youtube', _id: id, v_id: url, token: '', ftype: 'mp4', fquality: '360p' })
  }).then(res => res.json());

  return downloadInfo.result.url;
}

async function fetchInvidious(url) {
  const apiUrl = `https://invidious.io/api/v1/get_video_info`;

const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`);
const data = await response.json();

if (data && data.video) {
const videoInfo = data.video;
return videoInfo; 
} else {
throw new Error("No se pudo obtener información del video desde Invidious");
  }
}

async function fetch9Convert(url) {
const apiUrl = `https://9convert.com/en429/api`;
const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`);
const data = await response.json();

if (data.status === 'ok') {
    return data.result.mp3;
  } else {
    throw new Error("No se pudo obtener la descarga desde 9Convert");
  }
}
