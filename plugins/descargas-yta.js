/*import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import { exec } from 'child_process';

const handler = async (m, { args, conn }) => {
  if (!args[0]) 
    return m.reply('*[❗𝐈𝐍𝐅𝐎❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙈𝘼𝙎 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀*');

   const youtubeLink = args[0];

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(\S*)?$/;

  if (!youtubeRegex.test(youtubeLink)) {
    return m.reply('*[❗𝐄𝐑𝐑𝐎𝐑❗] 𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝙋𝙍𝙊𝙋𝙊𝙍𝘾𝙄𝙊𝙉𝘼𝘿𝙊 𝙉𝙊 𝙀𝙎 𝙑𝘼́𝙇𝙄𝘿𝙊. 𝘼𝙎𝙀𝙂𝙐́𝙍𝘼𝙏𝙀 𝘿𝙀 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝙍 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀.*');
  }

 try {
  await m.react('🕓');

 
  
  const apiUrl = `https://bk9.fun/download/ytmp3?url=${encodeURIComponent(youtubeLink)}&type=mp3`;

  let apiResponse = await fetch(apiUrl);
  let response = await apiResponse.json();

  if (response?.status && response?.BK9?.downloadUrl) {
    const { downloadUrl, title } = response.BK9;

    await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${title}.mp3`,
    }, { quoted: m });

    return await m.react('✅');
  }

  throw new Error("La API no retornó datos válidos");
} catch (error) {
  console.warn("Error en la API:", error.message);
  await m.reply("❌ Error al procesar la solicitud. Inténtalo más tarde.");
}

};

handler.help = ['yta'];
handler.tags = ['descargas'];
handler.command = /^yta|audio|fgmp3|dlmp3|mp3|getaud|yt(a|mp3|mp3)$/i;
handler.group = true;

export default handler;
*/
import fetch from "node-fetch";
import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `⚡ Ejemplo de uso: ${usedPrefix}${command} https://youtube.com/watch?v=Hx920thF8X4`, m);
    }

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
      return m.reply(`Enlace inválido. Asegúrate de que sea un enlace de YouTube.`);
    }

    m.react('🕒');

    let json = await ytdl(args[0], 'mp3'); // tipo audio
    let size = await getSize(json.url);

    const caption = `🎧 Su audio by *_KanBot_*:\n\n*🎵 Título:* ${json.title}\n*🌐 URL:* ${args[0]}\n*📦 Peso:* ${await formatSize(size) || "Desconocido"}`;

    await conn.sendMessage(m.chat, {
      audio: { url: json.url },
      mimetype: 'audio/mp4',
      fileName: `${json.title}.mp3`,
      ptt: false
    }, { quoted: m });

    m.react('✅');
  } catch (e) {
    console.error(e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['ytaudio'];
handler.command = ['ytmp3', 'ytaudio', 'yta'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;

// FUNCIONES AUXILIARES
async function ytdl(url, format = 'mp4') {
  const headers = {
    "accept": "*/*",
    "accept-language": "es-ES,es;q=0.9",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "Referer": "https://id.ytmp3.mobi/"
  };

  const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
  const init = await initial.json();
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
  const convertURL = init.convertURL + `&v=${id}&f=${format}&_=${Math.random()}`;

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

async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  bytes = Number(bytes);
  if (isNaN(bytes)) return 'Tamaño desconocido';
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
  } catch (error) {
    return null;
  }
}