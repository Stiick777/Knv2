import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';

const handler = async (m, { conn, command, text }) => {
  if (command === 'playv2') {
    if (!text) return conn.reply(m.chat, '*Ingresa el nombre del video que deseas buscar*', m);

    await m.react('🕓');

    try {
      const urlApi = `https://api.agatz.xyz/api/ytplayvid?message=${encodeURIComponent(text)}`;
      const { data: res } = await axios.get(urlApi);

      const info = res.data;
      const videoData = info.downloadLinks.video?.[0];
      if (!videoData?.url) throw new Error('No se encontró el video.');

      const texto = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝚅𝚒𝚍𝚎𝚘 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊
===========================
> *Título:* ${info.title}
> *Autor:* ${info.author}
> *Subido hace:* ${info.uploadedAt}
> *Vistas:* ${info.views.toLocaleString()}
> *Calidad:* ${videoData.quality}

*🎬 Enviando tu video...*
===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> Provided by Stiiven
`.trim();

      await conn.sendFile(m.chat, info.thumbnailUrl, 'thumb.jpg', texto, m);

      const videoBuffer = await (await fetch(videoData.url)).buffer();

      await conn.sendMessage(m.chat, {
        video: videoBuffer,
        mimetype: 'video/mp4',
        caption: info.title
      }, { quoted: m });

      await m.react('✅');
    } catch (err) {
      console.error(err);
      await m.react('❌');
      await conn.reply(m.chat, 'Hubo un error al obtener el video.', m);
    }
  }
};

handler.command = ['playv2'];
handler.help = ['playv2 <nombre>'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;
