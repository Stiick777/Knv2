import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import fs from 'fs';
import { exec } from 'child_process';

const handler = async (m, { conn, command, args, text }) => {
if (command == 'ply') {
  if (!text) return conn.reply(m.chat, `*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*`, m, rcanal);
  
  await m.react('🕓'); // Indicar que el proceso ha comenzado
  
  try {
    // Buscar el audio en la API de Agatz
    let apiUrl = `https://api.agatz.xyz/api/ytplay?message=${encodeURIComponent(text)}`;
    let { data: responseData } = await axios.get(apiUrl);

    if (!responseData.data || !responseData.data.audio || !responseData.data.audio.url) {
      throw new Error('No se encontró el audio.');
    }

    let info = responseData.data.info;
    let audio = responseData.data.audio;
    let originalPath = `./temp_audio.mp3`;
    let convertedPath = `./converted_audio.mp3`;

    // Descargar el audio
    const audioResponse = await axios.get(audio.url, { responseType: 'arraybuffer' });
    fs.writeFileSync(originalPath, audioResponse.data);

    // Convertir el audio a un formato compatible con WhatsApp (64kbps, 44100Hz)
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i ${originalPath} -ar 44100 -ab 64k -y ${convertedPath}`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Enviar mensaje con información
    let texto1 = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜 𝚅𝟸
===========================

> *𝚃𝚒𝚝𝚞𝚕𝚘* :  ${info.title}
> *𝙲𝚛𝚎𝚊𝚍𝚘𝚛* :  ${info.author.name}
> *𝙳𝚞𝚛𝚊𝚌𝚒ó𝚗* :  ${info.duration}
> *𝙵𝚎𝚌𝚑𝚊 𝚍𝚎 𝚜𝚞𝚋𝚒𝚍𝚊* :  ${info.uploaded}

*🚀 𝙎𝙴 𝙴𝚂𝚃𝙰 𝙳𝙴𝚂𝙰𝚁𝙶𝙰𝙽𝘿𝙾 𝙎𝚄 𝘼𝚄𝘿𝙸𝙾, 𝙴𝚂𝙿𝙴𝚁𝙴 𝚄𝙽 𝙼𝙾𝙼𝙴𝙽𝚃𝙾*

===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> Provided by Stiiven*
    `.trim();

    await conn.sendFile(m.chat, info.thumbnail, 'thumbnail.jpg', texto1, m);

    // Enviar el audio convertido
    await conn.sendMessage(m.chat, {
      audio: fs.readFileSync(convertedPath),
      mimetype: 'audio/mpeg'
    }, { quoted: m });

    // Eliminar archivos temporales
    fs.unlinkSync(originalPath);
    fs.unlinkSync(convertedPath);

    await m.react('✅'); // Indicar éxito
  } catch (error) {
    console.error('Error con la API:', error.message);
    await m.react('❌'); // Indicar error
    await conn.sendMessage(m.chat, 'Ocurrió un error al procesar la búsqueda :(', { quoted: m });
  }
}
};

// Configuración del handler
handler.command = ['ply'];
handler.help = ['ply <txt>'];
handler.tags = ['descargas']
handler.group = true;

export default handler;



