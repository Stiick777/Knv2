/*
import fetch from 'node-fetch';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊*`, m, rcanal );
    }

    let youtubeLink = args[0];
    
    // Verificación del enlace de YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(youtubeLink)) {
        return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗] Asegúrese de que sea un enlace de YouTube.*`, m, rcanal);
    }

try {   
    await m.react('🕛'); // Indicar que está procesando

    let apiResponse = await fetch(`https://bk9.fun/download/youtube?url=${encodeURIComponent(youtubeLink)}`);
    let data = await apiResponse.json();

    if (data.status && data.BK9?.BK8?.length > 0) {
        const videoTitle = data.BK9.title;
        const videoUrl = data.BK9.BK8[0].link; // Primer objeto del array BK8
        const quality = data.BK9.BK8[0].quality;

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            fileName: `${videoTitle}.mp4`,
            mimetype: 'video/mp4',
            caption: `😎 Su video by *_KanBot_*:\n\n*🎬 Título:* ${videoTitle}\n📌 *Calidad:* ${quality}`,
        }, { quoted: m });

        return await m.react('✅'); // Confirmar éxito
    }

    throw new Error("La API no devolvió datos válidos");

} catch (error) {
    console.warn("Error en la descarga del video:", error.message);
    await m.react('❌'); // Indicar error
}
//
};

handler.tags = ['descargas'];
handler.help = ['ytv', 'ytmp4']
handler.command = ['ytmp4', 'ytvideo', 'ytv'];
handler.group = true;

export default handler;
*/
import fetch from "node-fetch";
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `⚡ Ejemplo de uso: ytv https://youtube.com/watch?v=Hx920thF8X4`, m, rcanal);
    }

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
      return m.reply(`Enlace inválido. Asegúrese de que sea un enlace de YouTube válido.`);
    }

    await m.react('🕒');

    let json = await ytdl(args[0]);
    let size = await getSize(json.url);
    let MAX_SIZE = 104857600; // 100 MB en bytes
    let cap = `😎 Su video by *_KanBot_*:\n\n*🎬 Título:* ${json.title}\n*🌐 URL:* ${args[0]}\n*📦 Peso:* ${await formatSize(size) || "Desconocido"}`;

    let buffer = await (await fetch(json.url)).buffer();

    let options = {
      quoted: m,
      mimetype: 'video/mp4',
      fileName: `${json.title}.mp4`,
      caption: cap
    };

    if (size > MAX_SIZE) {
      // Enviar como documento si pesa más de 100MB
      await conn.sendMessage(m.chat, {
        document: buffer,
        ...options
      });
    } else {
      // Enviar como video normal
      await conn.sendFile(m.chat, buffer, `${json.title}.mp4`, cap, m, null, {
        mimetype: 'video/mp4'
      });
    }

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('Ocurrió un error al intentar procesar el video. Intenta nuevamente más tarde.');
  }
};

handler.help = ['ytmp4'];
handler.command = ['ytv2', 'ytmp4', 'ytv'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;

// Función para obtener los datos del video
async function ytdl(url) {
  const headers = {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };
  const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
  const init = await initial.json();
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
  const convertURL = init.convertURL + `&v=${id}&f=mp4&_=${Math.random()}`;

  const converts = await fetch(convertURL, { headers });
  const convert = await converts.json();

  let info = {};
  for (let i = 0; i < 3; i++) {
    const progressResponse = await fetch(convert.progressURL, { headers });
    info = await progressResponse.json();
    if (info.progress === 3) break;
  }

  return {
    url: convert.downloadURL,
    title: info.title
  };
}

// Formatear tamaño en MB/GB
async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  bytes = Number(bytes);

  if (isNaN(bytes)) {
    return 'Tamaño inválido';
  }

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(2)} ${units[i]}`;
}

// Obtener tamaño del archivo desde el URL
async function getSize(url) {
  try {
    const response = await axios.head(url);
    const contentLength = response.headers['content-length'];
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (error) {
    console.error('Error al obtener tamaño del archivo:', error.message);
    return null;
  }
}