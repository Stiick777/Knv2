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
  if (!text) return conn.reply(m.chat, `*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*`, m, );
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

  await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m, null);

   try {
    await m.react('🕓'); // Indicador de proceso

    // Primera API
    let primaryApiUrl = `https://apidl.asepharyana.cloud/api/downloader/ytmp3?url=${encodeURIComponent(yt_play[0].url)}`;
    let primaryApiResponse = await fetch(primaryApiUrl);
    let primaryResponseData = await primaryApiResponse.json();

    if (primaryResponseData.status === "tunnel" && primaryResponseData.url) {
        await conn.sendMessage(m.chat, {
            audio: { url: primaryResponseData.url },
            mimetype: 'audio/mpeg',
            fileName: primaryResponseData.filename || `${primaryResponseData.title}.mp3`,
            ptt: false,
        }, { quoted: m });

        await m.react('✅'); // Éxito
        return;
    }

    throw new Error('Fallo en la primera API');
} catch (error) {
    console.error('Error con la primera API:', error.message);

    try {
        await m.react('🕓'); // Reintento con la segunda API

        // Segunda API
        let fallbackApiUrl = `https://api.agungny.my.id/api/youtube-audio?url=${encodeURIComponent(yt_play[0].url)}`;
        let fallbackApiResponse = await fetch(fallbackApiUrl);
        let fallbackResponseData = await fallbackApiResponse.json();

        if (!fallbackResponseData.status || !fallbackResponseData.result || !fallbackResponseData.result.downloadUrl) {
            throw new Error('Fallo en la segunda API');
        }

        // Enviar el audio al chat
        await conn.sendMessage(m.chat, {
            audio: { url: fallbackResponseData.result.downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${fallbackResponseData.result.title}.mp3`,
            ptt: false,
        }, { quoted: m });

        await m.react('✅'); // Éxito
    } catch (error2) {
        console.error('Error con la segunda API:', error2.message);
        await m.react('❌'); // Error final
        await conn.sendMessage(m.chat, 'Ocurrió un error al procesar el enlace con ambas APIs.', { quoted: m });
    }
}

}

if (command == 'play2') {
    if (!text) return conn.reply(m.chat, `*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*`, m, );
    
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

    await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m, null);


try {
    await m.react('🕓'); // Reaccionar con un ícono de reloj mientras procesa

    // Primera API
    const apiUrl1 = `https://api.agungny.my.id/api/youtube-video?url=${encodeURIComponent(yt_play[0].url)}`;
    let apiResponse = await fetch(apiUrl1);
    let response = await apiResponse.json();

    // Verificar si la API devolvió un resultado válido
    if (response.status && response.result && response.result.downloadUrl) {
        const { downloadUrl, title } = response.result;

        await conn.sendMessage(m.chat, {
            video: { url: downloadUrl },
            caption: `🎥 *${title}*\n😎 Su video by ✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰`,
            mimetype: 'video/mp4',
        }, { quoted: m });

        return await m.react('✅'); // Reaccionar con éxito
    }

    throw new Error("Primera API falló, intentando con la segunda...");
} catch (error) {
    console.warn("Error en la primera API:", error.message);

    try {
        await m.react('🕓'); // Reaccionar de nuevo mientras procesa la segunda API

        // Segunda API (Respaldo)
        const apiUrl2 = `https://apidl.asepharyana.cloud/api/downloader/ytmp4?url=${encodeURIComponent(yt_play[0].url)}&quality=360`;
        let apiResponse2 = await fetch(apiUrl2);
        let response2 = await apiResponse2.json();

        // Verificar si la API de respaldo devuelve un resultado válido
        if (response2.url && response2.filename) {
            const { url: downloadUrl, filename } = response2;

            await conn.sendMessage(m.chat, {
                video: { url: downloadUrl },
                caption: `🎥 *${filename}*\n😎 Su video by ✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰`,
                mimetype: 'video/mp4',
            }, { quoted: m });

            return await m.react('✅'); // Reaccionar con éxito
        }

        throw new Error("Segunda API también falló.");
    } catch (backupError) {
        console.error("Error en la segunda API:", backupError.message);
        await m.react('❌'); // Reaccionar con un ícono de error si ambas fallan
        await conn.sendMessage(m.chat, 'No se pudo procesar el video con ninguna API. Intenta con otro enlace.', { quoted: m });
    }
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
