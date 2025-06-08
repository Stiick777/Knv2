import fetch from "node-fetch";
import axios from "axios";
import yts from 'yt-search';

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
> *𝚃𝚒𝚝𝚞𝚕𝚘* :  ${yt_play[0].title}
> *𝙲𝚛𝚎𝚊𝚍𝚘* :  ${yt_play[0].ago}
> *𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗* :  ${secondString(duracionSegundos)}
*🚀 Se está descargando el video, espere...*
===========================
✰ KanBot ✰
> *Provided by Stiiven*
`.trim();

    await conn.sendFile(m.chat, yt_play[0].thumbnail, 'thumb.jpg', texto1, m, null);

    try {
      let json = await ytdl(yt_play[0].url);
      let size = await getSize(json.url);
      let MAX_SIZE = 104857600; // 100 MB
      let cap = `😎 Su video by *_KanBot_*:\n\n*🎬 Título:* ${json.title}\n*🌐 URL:* ${yt_play[0].url}\n*📦 Peso:* ${await formatSize(size) || "Desconocido"}`;

      let buffer = await (await fetch(json.url)).buffer();

      let options = {
        quoted: m,
        mimetype: 'video/mp4',
        fileName: `${json.title}.mp4`,
        caption: cap
      };

      if (size > MAX_SIZE) {
        await conn.sendMessage(m.chat, {
          document: buffer,
          ...options
        });
      } else {
        await conn.sendFile(m.chat, buffer, `${json.title}.mp4`, cap, m, null, {
          mimetype: 'video/mp4'
        });
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
