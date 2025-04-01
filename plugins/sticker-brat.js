/*import { sticker } from '../lib/sticker.js';
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
*/
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import fluent from 'fluent-ffmpeg';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { fileTypeFromBuffer as fromBuffer } from 'file-type';

const handler = async (m, { conn, args }) => {
  let text;

  if (args.length >= 1) {
    text = args.join(' ');
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    return conn.reply(m.chat, '💡 Te faltó el texto!', m);
  }

  if (text.length > 40) return conn.reply(m.chat, '⚠️ El texto no puede tener más de 40 caracteres.', m);

  try {
    const apiUrl = `https://api.agungny.my.id/api/bratv1?q=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    if (!response.data) throw new Error('No se pudo obtener la imagen.');

    // Convertir la imagen a WebP con FFmpeg
    const webpBuffer = await toWebp(response.data);

    // Crear sticker con solo el autor
    const sticker = new Sticker(webpBuffer, {
      pack: "", // No mostrar packname
      author: global.author || "Bot", // Solo mostrar autor
      type: StickerTypes.FULL
    });

    const finalSticker = await sticker.toBuffer();
    await conn.sendFile(m.chat, finalSticker, 'sticker.webp', '', m, { asSticker: true });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Ocurrió un error al generar el sticker.', m);
  }
};

handler.help = ['brat <txt>'];
handler.tags = ['sticker'];
handler.command = ['brat', 'brt', 'sb'];
handler.group = true;
export default handler;

async function toWebp(buffer) {
  const { ext } = await fromBuffer(buffer);
  if (!/(png|jpg|jpeg|mp4|gif|webp)/i.test(ext)) throw 'Media no compatible.';

  const input = path.join(global.tempDir || './tmp', `${Date.now()}.${ext}`);
  const output = path.join(global.tempDir || './tmp', `${Date.now()}.webp`);
  fs.writeFileSync(input, buffer);

  let options = [
    '-vcodec', 'libwebp',
    '-loop', '0', '-preset', 'default', '-an', '-vsync', '0',
    '-vf', "scale=512:512:flags=lanczos"
  ];

  return new Promise((resolve, reject) => {
    fluent(input)
      .addOutputOptions(options)
      .toFormat('webp')
      .save(output)
      .on('end', () => {
        const result = fs.readFileSync(output);
        fs.unlinkSync(input);
        fs.unlinkSync(output);
        resolve(result);
      })
      .on('error', (err) => {
        fs.unlinkSync(input);
        reject(err);
      });
  });
}
