import { webp2mp4 } from '../lib/webp2mp4.js';
import { ffmpeg } from '../lib/converter.js';

const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply(`*🛑 Responda a un sticker que desee convertir en video con el comando ${usedPrefix + command}*`);
  }

  const mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply(`*🛑 Responda a un sticker que desee convertir en video con el comando ${usedPrefix + command}*`);
  }

  await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

  try {
    const media = await m.quoted.download();
    let out = Buffer.alloc(0);

    if (/webp/.test(mime)) {
      out = await webp2mp4(media);
    } else if (/audio/.test(mime)) {
      out = await ffmpeg(media, [
        '-filter_complex', 'color',
        '-pix_fmt', 'yuv420p',
        '-crf', '51',
        '-c:a', 'copy',
        '-shortest',
      ], 'mp3', 'mp4');
    }

    await conn.sendFile(m.chat, out, 'video.mp4', '*🌳 Su video*', m);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply('*🚫 Ocurrió un error al convertir el sticker en video. Inténtelo nuevamente.*');
  }
};

handler.help = ['tovideo'];
handler.tags = ['transformador'];
handler.group = true;
handler.command = ['tovideo', 'tomp4', 'mp4', 'togif'];

export default handler;
