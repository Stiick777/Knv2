
import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import { safeSend } from '../lib/safeSend.js';
import yts from 'yt-search';
import { yta } from './_ytdl.js';

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('*Ingresa el nombre de lo que quieres buscar*');
  await m.react('🕓');

if (command === 'playp2') {
  try {
    let info, audioUrl, thumbnail;

    // Primera API (diioffc)
    try {
      const urlApi1 = `https://api.diioffc.web.id/api/search/ytplay?query=${encodeURIComponent(text)}`;
      const { data: res1 } = await axios.get(urlApi1);

      if (!res1.status || !res1.result?.download?.url) throw new Error('Sin resultados en API 1');

      info = res1.result;
      audioUrl = info.download.url;
      thumbnail = info.thumbnail;
    } catch (err1) {
      console.log('⚠️ API 1 falló, intentando con API Vreden...', err1.message);

      // Segunda API (vreden)
      const urlApi2 = `https://api.vreden.my.id/api/v1/download/play/audio?query=${encodeURIComponent(text)}`;
      const { data: res2 } = await axios.get(urlApi2);

      if (!res2.status || !res2.result?.download?.url) throw new Error('Sin resultados en API 2');

      info = res2.result.metadata;
      audioUrl = res2.result.download.url;
      thumbnail = res2.result.metadata.thumbnail;
    }

    const texto = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊 𝚅𝟸
===========================
> *Título:* ${info.title || 'N/A'}
> *Autor:* ${info.author?.name || 'Desconocido'}
> *Duración:* ${info.duration?.timestamp || 'N/A'}
> *Fecha:* ${info.ago || 'N/A'}
> *Vistas:* ${info.views ? info.views.toLocaleString() : 'N/A'}

*🚀 Se está enviando tu audio...*
===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> Provided by Stiiven
`.trim();

  //  await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', texto, m);
await safeSend(conn, m.chat, thumbnail, { filename: 'thumbnail.jpg', caption: texto, quoted: m }, 'file');

    const audioBuffer = await (await fetch(audioUrl)).buffer();

    /*await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg'
    }, { quoted: m }); */
    
    await safeSend(conn, m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });

    await m.react('✅');
  } catch (err) {
    console.error(err);
    await m.react('❌');
    await conn.reply(m.chat, 'Ocurrió un error al procesar la búsqueda en todos los play :(', m);
  }


  } else if (command === 'play') {
    // Versión con yt-search y yta
    try {
      const res = await yts(text);
      if (!res || !res.all || res.all.length === 0) {
        return m.reply("No se encontraron resultados para tu búsqueda.");
      }

      const video = res.all[0];
      const cap = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊 𝚅𝟸
===========================
> *Título:* ${video.title}
> *Autor:* ${video.author.name}
> *Duración:* ${video.duration.timestamp}
> *Vistas:* ${video.views}

*🚀 Se está enviando tu audio...*
===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> Provided by Stiiven
`.trim();

      await conn.sendFile(m.chat, await (await fetch(video.thumbnail)).buffer(), "image.jpg", cap, m);

      const api = await yta(video.url);
      await conn.sendFile(m.chat, api.result.download, api.result.title, "", m);
      await m.react("✔️");
    } catch (error) {
      console.error(error);
      return m.reply("⚠️ Ocurrió un error al descargar el audio intente con `/playp.`");
    }
  }
};

handler.help = ['play <texto>', 'playp2 <texto>'];
handler.tags = ['descargas'];
handler.command = ['play', 'playp2'];

export default handler;