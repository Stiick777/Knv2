import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
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
    await m.react('🕓'); // Reacciona mientras procesa

    const url = yt_play[0].url;

    let title, downloadUrl;

    // --- API Principal: Ruby ---
    try {
        const apiUrlRuby = `https://ruby-core.vercel.app/api/download/youtube/mp3?url=${encodeURIComponent(url)}`;
        const apiResponseRuby = await fetch(apiUrlRuby);
        const responseRuby = await apiResponseRuby.json();

        if (responseRuby.status && responseRuby.download && responseRuby.download.url) {
            title = responseRuby.metadata.title;
            downloadUrl = responseRuby.download.url;
        }
    } catch (e) {
        console.log('❌ Ruby falló, intentando Yupra...');
    }

    // --- Respaldo: Yupra ---
    if (!downloadUrl) {
        try {
            const apiUrlYupra = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`;
            const apiResponseYupra = await fetch(apiUrlYupra);
            const responseYupra = await apiResponseYupra.json();

            if (responseYupra.status === 200 && responseYupra.result && responseYupra.result.link) {
                title = responseYupra.result.title;
                downloadUrl = responseYupra.result.link;
            }
        } catch (e) {
            console.log('❌ Yupra falló, intentando Zenzxz...');
        }
    }

    // --- Respaldo: Zenzxz ---
    if (!downloadUrl) {
        try {
            const apiUrlZenz = `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`;
            const apiResponseZenz = await fetch(apiUrlZenz);
            const responseZenz = await apiResponseZenz.json();

            if (responseZenz.status && responseZenz.download_url) {
                title = responseZenz.title;
                downloadUrl = responseZenz.download_url;
            }
        } catch (e) {
            console.log('❌ Zenzxz falló, intentando Sylphy...');
        }
    }

    // --- Respaldo: Sylphy ---
    if (!downloadUrl) {
        try {
            const apiUrlSylphy = `https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(url)}&apikey=sylphy-25c2`;
            const apiResponseSylphy = await fetch(apiUrlSylphy);
            const responseSylphy = await apiResponseSylphy.json();

            if (responseSylphy.status && responseSylphy.res && responseSylphy.res.url) {
                title = responseSylphy.res.title;
                downloadUrl = responseSylphy.res.url;
            }
        } catch (e) {
            console.log('❌ Sylphy falló, intentando Stellar...');
        }
    }

    // --- Respaldo: Stellar ---
    if (!downloadUrl) {
        try {
            const apiUrlStellar = `https://api.stellarwa.xyz/dow/ytmp3?url=${encodeURIComponent(url)}&apikey=stellar-53mIXDr2`;
            const apiResponseStellar = await fetch(apiUrlStellar);
            const responseStellar = await apiResponseStellar.json();

            if (responseStellar.status && responseStellar.data && responseStellar.data.dl) {
                title = responseStellar.data.title;
                downloadUrl = responseStellar.data.dl;
            }
        } catch (e) {
            console.log('❌ Stellar también falló');
        }
    }

    if (!downloadUrl) throw new Error('No se pudo obtener el enlace desde ninguna API.');

    // --- Enviar audio ---
    await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mp4',
        fileName: `${title}.mp3`,
        ptt: false,
        tmpfs: true
    }, { quoted: m });

    await m.react('✅'); // Éxito

} catch (err) {
    await m.react('❌');
    console.error(err);
    await conn.sendMessage(m.chat, { text: `❌ Error: ${err.message}` }, { quoted: m });
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

    /* ======================================================
       🔹 SERVIDOR 1: Zenzxz (720p)
    ======================================================= */
    try {
        let apiZ = await fetch(
            `https://api.zenzxz.my.id/api/downloader/ytmp4v2?url=${encodeURIComponent(url)}&resolution=720`
        );
        let resZ = await apiZ.json();

        if (resZ.success && resZ.data?.download_url) {

            const data = resZ.data;

            await conn.sendMessage(m.chat, {
                video: { url: data.download_url },
                caption: `*${data.title}*\nDuración: ${data.duration}s\nCalidad: ${data.format}`,
                jpegThumbnail: await (await fetch(data.thumbnail)).buffer(),
                tmpfs: true
            }, { quoted: m });

            await m.react('✅');
            return;
        }
    } catch {}



    /* ======================================================
       🔹 SERVIDOR 2: XYRO (720p)
    ======================================================= */
    try {
        let apiX = await fetch(
            `https://api.xyro.site/download/youtubemp4?url=${encodeURIComponent(url)}&quality=720`
        );
        let resX = await apiX.json();

        if (resX.status && resX.result?.download) {

            const r = resX.result;

            await conn.sendMessage(m.chat, {
                video: { url: r.download },
                caption: `*${r.title}*\nDuración: ${r.duration}s\nCalidad: ${r.quality}p`,
                jpegThumbnail: await (await fetch(r.thumbnail)).buffer(),
                tmpfs: true
            }, { quoted: m });

            await m.react('✅');
            return;
        }
    } catch {}



    /* ======================================================
       🔹 SERVIDOR 3: Yupra (360p)
    ======================================================= */
    try {
        let apiY = await fetch(
            `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`
        );
        let resY = await apiY.json();

        if (resY.status === 200 && resY.result?.formats?.length) {

            let best = resY.result.formats[0];

            await conn.sendMessage(m.chat, {
                video: { url: best.url },
                caption: `*${resY.result.title}*\nCalidad: ${best.qualityLabel || best.quality}`,
                tmpfs: true
            }, { quoted: m });

            await m.react('✅');
            return;
        }
    } catch {}



    /* ======================================================
       🔹 SERVIDOR 4: Starlight (360p)
    ======================================================= */
    try {
        let apiS = await fetch(
            `https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(url)}&format=360p`
        );
        let resS = await apiS.json();

        if (resS.dl_url) {

            await conn.sendMessage(m.chat, {
                video: { url: resS.dl_url },
                caption: `*${resS.title}*\nAutor: ${resS.author}\nCalidad: ${resS.quality}`,
                jpegThumbnail: await (await fetch(resS.thumbnail)).buffer(),
                tmpfs: true
            }, { quoted: m });

            await m.react('✅');
            return;
        }
    } catch {}



    /* ======================================================
       🔹 SERVIDOR 5: Vreden (360 → 1080p)
       URL: https://api.vreden.my.id/api/v1/download/youtube/video
    ======================================================= */
    try {
        let apiV = await fetch(
            `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(url)}&quality=360`
        );
        let resV = await apiV.json();

        if (resV.status && resV.result?.download?.url) {

            const meta = resV.result.metadata;
            const down = resV.result.download;

            await conn.sendMessage(m.chat, {
                video: { url: down.url },
                caption: `*${meta.title}*\nDuración: ${meta.duration.timestamp}\nCalidad: ${down.quality}`,
                jpegThumbnail: await (await fetch(meta.thumbnail)).buffer(),
                tmpfs: true
            }, { quoted: m });

            await m.react('✅');
            return;
        }
    } catch {}



    throw '❌ Ningún servidor devolvió resultados.';

} catch (e) {
    console.error(e);
    await m.react('❌');
    await m.reply('⚠️ No se pudo descargar el video intente con playv2.');
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
