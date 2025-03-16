import { sticker } from '../lib/sticker.js';
import axios from 'axios';

const handler = async (m, { conn, args }) => {
  let text;
  
  if (args.length >= 1) {
    text = args.join(' ');
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    return conn.reply(m.chat, '💡 Te faltó el texto!', m);
  }

  if (text.length > 40) return conn.reply(m.chat, '⚠️ El texto no puede tener más de 10 caracteres.', m);

  try {
    const apiUrl = `https://api.agungny.my.id/api/bratv1?q=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    if (!response.data) throw new Error('No se pudo obtener la imagen.');

    const stickerBuffer = await sticker(response.data, false, global.packsticker, global.author);

    if (stickerBuffer) {
      await conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m, { asSticker: true });
    } else {
      throw new Error('Error al convertir la imagen en sticker.');
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Ocurrió un error al generar el sticker.', m);
  }
};

handler.help = ['brat <txt>'];
handler.tags = ['sticker'];
handler.command = ['brat', 'brt', 'sb'];
handler.group = true
export default handler;