
import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import yts from 'yt-search';
import { yta } from './_ytdl.js';

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('*Ingresa el nombre de lo que quieres buscar*');
  await m.react('🕓');

  if (command === 'playp2') {
    // Versión con API externa
    try {
      const urlApi = `https://api.diioffc.web.id/api/search/ytplay?query=${encodeURIComponent(text)}`;
      const { data: res } = await axios.get(urlApi);

      if (!res.status || !res.result?.download?.url) throw new Error('No se encontró el audio.');

      const info = res.result;
      const audioUrl = info.download.url;
      const thumbnail = info.thumbnail;

      const texto = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊 𝚅𝟸
===========================
> *Título:* ${info.title}
> *Autor:* ${info.author.name}
> *Duración:* ${info.duration.timestamp}
> *Fecha:* ${info.ago}
> *Vistas:* ${info.views.toLocaleString()}

*🚀 Se está enviando tu audio...*
===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> Provided by Stiiven
`.trim();

      await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', texto, m);

      const audioBuffer = await (await fetch(audioUrl)).buffer();

      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg'
      }, { quoted: m });

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