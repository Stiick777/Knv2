import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import yts from 'yt-search';
import { yta } from './_ytdl.js';

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('*Ingresa el nombre de lo que quieres buscar*');
  await m.react('🕓');

  try {
    const res = await yts(text);
    if (!res || !res.all || res.all.length === 0) {
      return m.reply("No se encontraron resultados para tu búsqueda.");
    }

    const video = res.all[0];

    // 🚨 Verificar duración
    const duracionSeg = video.duration.seconds || 0;
    if (duracionSeg > 3600) {
      return m.reply("❗ *El audio es superior a 1h*");
    }

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
    return m.reply("⚠️ Ocurrió un error al descargar el audio intente con /playp");
  }
};

handler.help = ['play <texto>'];
handler.tags = ['descargas'];
handler.command = ['play'];

export default handler;
