import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';

const handler = async (m, { conn, command, text }) => {
  if (command === 'playv2') {
    if (!text) return conn.reply(m.chat, '*Ingresa el nombre del video que deseas buscar*', m);

    await m.react('🕓');

    try {
      const urlApi = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`;
      const { data: res } = await axios.get(urlApi);

      if (!res.result || !res.result.download?.url) throw new Error('No se encontró el video.');

      const info = res.result;
      const meta = info.metadata;
      const download = info.download;

      const texto = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝚅𝚒𝚍𝚎𝚘 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊
===========================
> *Título:* ${meta.title}
> *Autor:* ${meta.author?.name}
> *Subido hace:* ${meta.ago}
> *Vistas:* ${meta.views.toLocaleString()}
> *Duración:* ${meta.duration?.timestamp}
> *Calidad:* ${download.quality}

*🎬 Enviando tu video...*
===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> Provided by Stiiven 
`.trim();

      await conn.sendFile(m.chat, meta.thumbnail, 'thumb.jpg', texto, m);

      const videoBuffer = await (await fetch(download.url)).buffer();

      await conn.sendMessage(m.chat, {
        video: videoBuffer,
        mimetype: 'video/mp4',
        caption: meta.title
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
