
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios'
const LimitAud = 725 * 1024 * 1024; //700MB
const LimitVid = 425 * 1024 * 1024; //425MB
const handler = async (m, {conn, command, args, text, usedPrefix}) => {


if (command == 'play7' || command == 'playdoc') {
  if (!text) 
    return conn.reply(
      m.chat, 
      `🧿 *Ingrese un nombre de una canción de YouTube*\n\nEjemplo: !${command} falling - Daniel Trevor`,  
      m, 
      rcanal
    );
  
  await m.react('🕛');
  const yt_play = await search(args.join(' '));
  
  const texto1 = `
┏◚◚◚◚🅓🅞🅒🅢◚◚◚◚┓

🍁 𝚃𝚒𝚝𝚞𝚕𝚘:
${yt_play[0].title}

🎀 𝙿𝚞𝚋𝚕𝚒𝚌𝚊𝚍𝚘:
${yt_play[0].ago}

⏰ 𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗:
${secondString(yt_play[0].duration.seconds)}

🖋️ 𝙰𝚞𝚝𝚘𝚛:
${yt_play[0].author.name}

🧿 𝚄𝚁𝙻:
${yt_play[0].url}

📌 𝙲𝚊𝚗𝚊𝚕:
${yt_play[0].author.url}

┗◛◛◛🅚🅐🅝🅑🅞🅣◛◛◛┛

*𝙴𝚗𝚟𝚒𝚊𝚗𝚍𝚘 𝚜𝚞 Audio 𝙿𝚘𝚛 𝙵𝚊𝚟𝚘𝚛 𝙴𝚜𝚙𝚎𝚛𝚎*`.trim();

  await conn.sendMessage(m.chat, { text: texto1 }, { quoted: m });

  try {
    await m.react('🕛');
    const apiUrl = `https://apidl.asepharyana.cloud/api/downloader/ytmp3?url=${encodeURIComponent(yt_play[0].url)}`;
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    if (data.downloadUrl) {
      await conn.sendMessage(
        m.chat, 
        {
          document: { url: data.downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: `${data.title}.mp3`,
          caption: `🌚 *_Provided by KanBot_* 🌝`
        }, 
        { quoted: m }
      );
      await m.react('✅');
    } else {
      throw new Error('No se pudo obtener el enlace de descarga.');
    }
  } catch (e) {
    await m.react('❌');
    console.error(e);
    conn.reply(m.chat, `❌ *Error al obtener el audio. Intente nuevamente más tarde.*`, m, rcanal);
  }
}

if (command == 'play8' || command == 'playdoc2') {
    if (!text) return conn.reply(m.chat, `🧿 *Ingrese un nombre de una canción de YouTube*\n\nEjemplo: !${command} falling - Daniel Trevor`, m, rcanal);
    await m.react('🕛');
    const yt_play = await search(args.join(' '));
    if (yt_play[0].duration.seconds > 7200) {
    await conn.reply(m.chat, '❌ El video dura más de 2 horas y no puede ser descargado esto no es Netflix rey.', m);
    await m.react('❌');
    return;
}
    const texto1 = `
┏◚◚◚◚🅓🅞🅒🅢◚◚◚◚┓

🍁 𝚃𝚒𝚝𝚞𝚕𝚘:
${yt_play[0].title}

🎀 𝙿𝚄𝙱𝙻𝙸𝙲𝙰𝙳𝙾:
${yt_play[0].ago}

⏰ 𝙳𝚄𝚁𝙰𝙲𝙸𝙾𝙽:
${secondString(yt_play[0].duration.seconds)}

🖋️ 𝙰𝚄𝚃𝙾𝚁:
${yt_play[0].author.name}

🧿 𝚄𝚁𝙻:
${yt_play[0].url}

📌 𝙲𝙰𝙽𝙰𝙻:
${yt_play[0].author.url}

┗◛◛◛🅚🅐🅝🅑🅞🅣◛◛◛┛

*𝙴𝚗𝚟𝚒𝚊𝚗𝚍𝚘 𝚜𝚞 Video 𝙿𝚘𝚛 𝙵𝚊𝚟𝚘𝚛 𝙴𝚜𝚙𝚎𝚛𝚎*`.trim();

    await conn.sendMessage(m.chat, { text: texto1 }, { quoted: m });
    
 try {
    await m.react('🕓');
    const url = yt_play[0].url;

    const api2 = await fetch(`https://api.agatz.xyz/api/ytmp4?url=${encodeURIComponent(url)}`);
    const res2 = await api2.json();

    if (res2.status === 200 && res2.data?.success) {
        const { title, downloadUrl } = res2.data;

        await conn.sendMessage(m.chat, {
            document: { url: downloadUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n\n🌚 *_Provided by KanBot_* 🌝`
        }, { quoted: m });

        await m.react('✅');
        return;
    }
} catch (e) {
    console.warn('Error en API 2 (Agatz):', e);
}
try {
    await m.react('🕓');
    const url = yt_play[0].url;

    const api2 = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`);
    const res2 = await api2.json();

    if (res2.status && res2.data?.download?.url) {
        const { title, duration, views, author } = res2.data;
        const downloadUrl = res2.data.download.url;

        await conn.sendMessage(m.chat, {
            document: { url: downloadUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n🕒 Duración: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')} minutos\n👀 Vistas: ${views}\n🎙 Canal: ${author}\n\n🌚 *_Provided by KanBot_* 🌝`
        }, { quoted: m });

        await m.react('✅');
        return; // ✅ Éxito, no continuar con otras APIs
    }
} catch (e) {
    console.warn('Error en API 2 (Delirius):', e);
}
try {
    await m.react('🕓');
    const url = yt_play[0].url;

    const api4 = await fetch(`https://api.ryzumi.vip/api/downloader/ytmp4?url=${encodeURIComponent(url)}&quality=360`, {
        headers: { 'accept': 'application/json' }
    });

    const res4 = await api4.json();

    if (res4?.url) {
        const { title, author, views, lengthSeconds, quality, url: downloadUrl } = res4;

        await conn.sendMessage(m.chat, {
            document: { url: downloadUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n👤 Autor: ${author}\n👁️ Vistas: ${views}\n🕒 Duración: ${lengthSeconds}s\n📥 Calidad: ${quality}\n\n🌚 *_Provided by KanBot_* 🌝`
        }, { quoted: m });

        await m.react('✅');
        return;
    }
} catch (e) {
    console.warn('Error en API 4 (Ryzumi):', e);
}

try {
    await m.react('🕓');
    const url = yt_play[0].url;

    const api5 = await fetch(`https://www.dark-yasiya-api.site/download/ytmp4?url=${encodeURIComponent(url)}&quality=360`);
    const res5 = await api5.json();

    if (res5?.status && res5.result?.download?.url) {
        const video = res5.result.data;
        const download = res5.result.download;

        await conn.sendMessage(m.chat, {
            document: { url: download.url },
            mimetype: 'video/mp4',
            fileName: `${video.title}.mp4`,
            caption: `🎬 *${video.title}*\n👤 Autor: ${video.author.name}\n🕒 Duración: ${video.duration.timestamp}\n👁️ Vistas: ${video.views}\n📥 Calidad: ${download.quality}p\n\n🌚 *_Provided by KanBot_* 🌝`
        }, { quoted: m });

        await m.react('✅');
        return;
    }
} catch (e) {
    console.warn('Error en API 5 (DarkYasiya):', e);
}

try {
    await m.react('🕓');
    const url = yt_play[0].url;

    const api3 = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(url)}`);
    const res3 = await api3.json();

    if (res3.status === 200 && res3.result?.download?.url) {
        const { metadata: { title, timestamp, views, author }, download: { url: downloadUrl } } = res3.result;

        await conn.sendMessage(m.chat, {
            document: { url: downloadUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n📺 Duración: ${timestamp}\n👀 Vistas: ${views.toLocaleString()}\n🎙 Autor: ${author.name}\n🔗 Canal: ${author.url}\n\n🌚 *_Provided by KanBot_* 🌝`
        }, { quoted: m });

        await m.react('✅');
        return;
    }
} catch (e) {
    console.warn('Error en API 3:', e);
}

try {
    await m.react('🕓');
    const url = yt_play[0].url;

    const api2 = await fetch(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(url)}&type=video&quality=720p&apikey=Paimon`);
    const res2 = await api2.json();

    if (res2.status && res2.data?.url) {
        const { title, fduration, views, channel } = res2;
        const { url: downloadUrl } = res2.data;

        await conn.sendMessage(m.chat, {
            document: { url: downloadUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n🕒 Duración: ${fduration}\n👁️ Vistas: ${views}\n📺 Canal: ${channel}\n\n🌚 *_Provided by KanBot_* 🌝`
        }, { quoted: m });

        await m.react('✅');
        return;
    }
} catch (e) {
    console.warn('Error en API 2 (Neoxr):', e);
}

try {
    await m.react('🕓');
    const url = yt_play[0].url;

    const api1 = await fetch('https://api.siputzx.my.id/api/d/ytmp4', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    const res1 = await api1.json();

    if (res1.status && res1.data?.dl) {
        const { title, dl } = res1.data;

        await conn.sendMessage(m.chat, {
            document: { url: dl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n\n🌚 *_Provided by KanBot_* 🌝`
        }, { quoted: m });

        await m.react('✅');
        return;
    }
} catch (e) {
    console.warn('Error en API 1 (Siputzx):', e);
}

// Si todas fallan:
await m.react('❌');
//
}

}
handler.help = ['play7', 'play8', 'playdoc2', 'playdoc'];
handler.tags = ['descargas'];
handler.command = ['play7', 'playdoc', 'playdoc2' , 'play8']
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
