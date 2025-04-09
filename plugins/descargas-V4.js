import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';

const handler = async (m, { conn, command, text }) => {
  if (command === 'play2') {
    if (!text) return conn.reply(m.chat, '*Ingresa el nombre del video que deseas buscar*', m);

    await m.react('🕓'); // Indicador de carga

    try {
      const urlApi = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`;
      const { data: res } = await axios.get(urlApi);

      const info = res.result;
      if (!res.status || !info.download?.url) throw new Error('No se encontró el video.');

      const videoUrl = info.download.url;
      const thumbnail = info.metadata.thumbnail;

      const texto = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙼𝙿𝟺 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊
===========================
> *Título:* ${info.metadata.title}
> *Autor:* ${info.metadata.author.name}
> *Duración:* ${info.metadata.duration.timestamp}
> *Fecha:* ${info.metadata.ago}
> *Vistas:* ${info.metadata.views.toLocaleString()}

*📽️ Enviando tu video...*
===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> Powered by Stiiven
`.trim();

      await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', texto, m);

      const videoBuffer = await (await fetch(videoUrl)).buffer();

      await conn.sendMessage(m.chat, {
        video: videoBuffer,
        mimetype: 'video/mp4',
        caption: info.metadata.title
      }, { quoted: m });

      await m.react('✅');
    } catch (err) {
      console.error(err);
      await m.react('❌');
      await conn.reply(m.chat, 'Ocurrió un error al obtener el video.', m);
    }
  }
};

handler.command = ['play2'];
handler.help = ['play2 <nombre>'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;