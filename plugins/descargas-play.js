import { fileTypeFromBuffer } from "file-type";
import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios'
import fs from 'fs'
import { exec } from 'child_process'
//import { execSync } from 'child_process'
const LimitAud = 725 * 1024 * 1024; //700MB
const LimitVid = 425 * 1024 * 1024; //425MB
const handler = async (m, {conn, command, args, text, usedPrefix}) => {


if (command === 'playp') {
    if (!text) return conn.reply(m.chat, `*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*`, m, rcanal);

    await m.react('🕓');

    // Buscar en YouTube
    const yt_play = await search(args.join(' '));

    // 🚨 Verificar duración antes de enviar mensaje o descargar
    const duracion = yt_play[0].duration.seconds || 0;

    if (duracion > 3600) {
        return conn.reply(m.chat, "❗ *El audio es superior a 1h*", m, rcanal);
    }

    const texto1 = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜
===========================

> *𝚃𝚒𝚝𝚞𝚕𝚘* :  ${yt_play[0].title}

> *𝙲𝚛𝚎𝚊𝚍𝚘* :  ${yt_play[0].ago}

> *𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗* :  ${secondString(yt_play[0].duration.seconds)}

*🚀 𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝘼𝙐𝘿𝙄𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊*

===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> *Provided by Stiiven*
`.trim();

        await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m, null);
try {
    await m.react('🕓'); // Procesando

    const url = yt_play[0].url;
    let title, downloadUrl;

    // ─── API PRINCIPAL: AKIRAX ───
    try {
        const apiAkirax = `https://akirax-api.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`;
        const resAkirax = await fetch(apiAkirax);
        const dataAkirax = await resAkirax.json();

        if (dataAkirax.status && dataAkirax.result?.download) {
            title = dataAkirax.result.title;
            downloadUrl = dataAkirax.result.download;
        }
    } catch (e) {
        console.log('❌ Akirax falló, intentando Vreden...');
    }

    // ─── RESPALDO: VREDEN ───
    if (!downloadUrl) {
        try {
            const apiVreden = `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(url)}&quality=128`;
            const resVreden = await fetch(apiVreden);
            const dataVreden = await resVreden.json();

            if (
                dataVreden.status &&
                dataVreden.result?.download?.status &&
                dataVreden.result.download.url
            ) {
                title = dataVreden.result.metadata.title;
                downloadUrl = dataVreden.result.download.url;
            }
        } catch (e) {
            console.log('❌ Vreden también falló');
        }
    }

    if (!downloadUrl) {
        throw new Error('No se pudo obtener el audio desde ninguna API.');
    }

    // ─── ENVIAR AUDIO ───
    await conn.sendMessage(
        m.chat,
        {
            audio: { url: downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            ptt: false
        },
        { quoted: m }
    );

    await m.react('✅'); // Éxito

} catch (err) {
    await m.react('❌');
    console.error(err);
    await conn.sendMessage(
        m.chat,
        { text: `❌ Error: ${err.message}` },
        { quoted: m }
    );
}
//
    }

if (command == 'play2') {
    if (!text) return conn.reply(m.chat, `*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*`, m, rcanal);
    
    await m.react('🕓'); 

    const yt_play = await search(args.join(' '));
    
    // Validación de duración
    const duracionSegundos = yt_play[0].duration.seconds || 0;
    if (duracionSegundos > 3600) {
        return conn.reply(m.chat, `❌ *El video supera la duración máxima permitida de 1 hora.*\n\n📌 *Duración del video:* ${secondString(duracionSegundos)} Esto no es Amazon Prime Video`, m);
    }

    const texto1 = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜
===========================

> *𝚃𝚒𝚝𝚞𝚕𝚘* :  ${yt_play[0].title}

> *𝙲𝚛𝚎𝚊𝚍𝚘* :  ${yt_play[0].ago}

> *𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗* :  ${secondString(duracionSegundos)}

*🚀 𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊*

===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> *Provided by Stiiven
`.trim();

    await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m, null);

try {
    await m.react('🕓');
    const url = yt_play[0].url;

    // ======================================================
    // ⚙️ FUNCIÓN PARA ENVIAR VIDEO SEGÚN TAMAÑO
    // ======================================================
    async function enviarVideo(chat, url, caption, thumbnail, quoted) {
        try {
            const head = await fetch(url, { method: 'HEAD' });
            const size = head.headers.get('content-length');

            const isLarge = size && Number(size) > 10 * 1024 * 1024; // 10MB

            if (isLarge) {
                return conn.sendMessage(chat, {
                    document: { url },
                    mimetype: 'video/mp4',
                    fileName: 'video.mp4',
                    caption,
                    jpegThumbnail: thumbnail
                }, { quoted });
            } else {
                return conn.sendMessage(chat, {
                    video: { url },
                    caption,
                    jpegThumbnail: thumbnail
                }, { quoted });
            }
        } catch {
            return conn.sendMessage(chat, {
                video: { url },
                caption,
                jpegThumbnail: thumbnail
            }, { quoted });
        }
    }

    // ======================================================
    // ⭐ API PRINCIPAL: XYRO
    // ======================================================
    try {
        const response = await axios.post(
            "https://api.xyro.site/download/youtube",
            new URLSearchParams({ url }).toString(),
            {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/x-www-form-urlencoded"
                }
            }
        );

        const json = response.data;

        if (!json.success || !json.medias?.length) {
            throw new Error("XYRO inválido");
        }

        const media = json.medias[0];
        const thumb = json.thumbnail
            ? await (await fetch(json.thumbnail)).buffer()
            : null;

        await enviarVideo(
            m.chat,
            media.url,
            `*${json.title}*\nDuración: ${json.duration}s\nCalidad: ${media.qualityLabel || media.label}`,
            thumb,
            m
        );

        await m.react('✅');
        return;

    } catch (e1) {
        console.warn("XYRO falló, usando VREDEN");
    }

    // ======================================================
    // ⭐ RESPALDO: VREDEN (360p)
    // ======================================================
    try {
        const apiV = await fetch(
            `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(url)}&quality=360`
        );
        const resV = await apiV.json();

        if (!resV.status || !resV.result?.download?.url) {
            throw new Error("VREDEN inválido");
        }

        const meta = resV.result.metadata;
        const down = resV.result.download;
        const thumb = meta.thumbnail
            ? await (await fetch(meta.thumbnail)).buffer()
            : null;

        await enviarVideo(
            m.chat,
            down.url,
            `*${meta.title}*\nDuración: ${meta.duration.timestamp}\nCalidad: ${down.quality}`,
            thumb,
            m
        );

        await m.react('✅');
        return;

    } catch (e2) {
        throw '❌ Ningún servidor devolvió resultados.';
    }

} catch (e) {
    console.error(e);
    await m.react('❌');
    await m.reply('⚠️ No se pudo descargar el video, intente con *playv2*.');
}

}

}
handler.help = ['playp', 'play2'];
handler.tags = ['descargas'];
handler.command = ['play2', 'playp']
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

/*
import yts from 'yt-search';
import fetch from 'node-fetch';
let limit = 320;
let confirmation = {};

let handler = async (m, { conn, command, text, args, usedPrefix }) => {
    if (!text) throw `✳️ Ejemplo: *${usedPrefix + command}* Lil Peep hate my life`;

    let res = await yts(text);
    let vid = res.videos[0];
    if (!vid) throw `✳️ Vídeo/Audio no encontrado`;

    let { title, thumbnail, videoId, timestamp, views, ago, url } = vid;

    m.react('🎧');

    let playMessage = `
≡ *YOUTUBE MUSIC*
┌──────────────
▢ 📌 *Título:* ${title}
▢ 📆 *Subido hace:* ${ago}
▢ ⌚ *Duración:* ${timestamp}
▢ 👀 *Vistas:* ${views.toLocaleString()}
└──────────────`;

    conn.sendButton(m.chat, playMessage, null, thumbnail, [
        ['🎶 MP3', `${usedPrefix}yta ${url}`],
        ['🎥 MP4', `${usedPrefix}ytv ${url}`]
    ], m);
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play', 'play2'];
handler.disabled = false;
handler.group = true;

export default handler;
*/
