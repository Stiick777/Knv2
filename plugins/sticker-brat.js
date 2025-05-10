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

import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import fluent from 'fluent-ffmpeg'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'
import axios from 'axios'

let handler = async (m, { conn, args }) => {
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
    const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isVideo=false&delay=500`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    if (!response.data) throw new Error('No se pudo obtener la imagen.');

    // Convertimos a WebP
    const webpBuffer = await toWebp(response.data);

    // Crear sticker
    const sticker = new Sticker(webpBuffer, {
      pack: '',
      author: global.author || 'Bot',
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
  const { ext } = await fromBuffer(buffer) || { ext: 'png' };
  if (!/(png|jpg|jpeg|gif|webp)/i.test(ext)) throw 'Media no compatible.';

   const timestamp = Date.now();
const input = path.join(global.tempDir || './tmp', `${timestamp}.${ext}`);
const output = path.join(global.tempDir || './tmp', `${timestamp}_out.webp`);
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
