/*import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
	
    if (!args[0]) {
        conn.reply(m.chat, `📌 Ejemplo de uso: ${usedPrefix + command} 😎+🤑`, m, rcanal);
        return;
    }

    if (!text.includes('+')) {
        conn.reply(m.chat, `✳️ Debes separar los emojis con un *+* \n\n📌 Ejemplo: \n*${usedPrefix + command}* 😎+🤑`, m, rcanal);
        return;
    }

    let [emoji, emoji2] = text.split`+`;
    let anu = await (await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji)}_${encodeURIComponent(emoji2)}`)).json();

    for (let res of anu.results) {
        let stiker = await sticker(false, res.url, global.packname, global.author);
        conn.sendFile(m.chat, stiker, null, { asSticker: true }, m);
    }
};

handler.help = ['emojimix <emoji+emoji>'];
handler.tags = ['sticker'];
handler.command = ['emojimix'];
handler.group = true;

export default handler;
*/
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import fluent from 'fluent-ffmpeg';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { fileTypeFromBuffer as fromBuffer } from 'file-type';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `📌 Ejemplo de uso: ${usedPrefix + command} 😎+🤑`, m);
  }

  if (!text.includes('+')) {
    return conn.reply(m.chat, `✳️ Debes separar los emojis con un *+* \n\n📌 Ejemplo: \n*${usedPrefix + command}* 😎+🤑`, m);
  }

  let [emoji, emoji2] = text.split`+`;
  let url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji)}_${encodeURIComponent(emoji2)}`;

  try {
    await m.react('🕓'); // reacción de carga

    const res = await (await fetch(url)).json();

    for (let item of res.results) {
      let imageBuffer = await fetchToBuffer(item.url);
      const webpBuffer = await toWebp(imageBuffer);

      const sticker = new Sticker(webpBuffer, {
        pack:  '',
        author: global.author || 'Bot',
        type: StickerTypes.FULL
      });

      const finalSticker = await sticker.toBuffer();

      await conn.sendFile(m.chat, finalSticker, 'sticker.webp', '', m);
    }

    await m.react('✅'); // reacción de éxito
  } catch (err) {
    console.error(err);
    await m.react('✖️'); // error
    conn.reply(m.chat, '❌ Ocurrió un error generando el sticker.', m);
  }
};

handler.help = ['emojimix <emoji+emoji>'];
handler.tags = ['sticker'];
handler.command = ['emojimix'];
handler.group = true; // puede funcionar también fuera de grupos

export default handler;

// Helpers

async function fetchToBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo descargar la imagen.');
  return await res.buffer();
}

async function toWebp(buffer) {
  const { ext } = await fromBuffer(buffer);
  if (!/(png|jpg|jpeg)/i.test(ext)) throw 'Media no compatible.';

  const input = path.join(global.tempDir || './tmp', `${Date.now()}.${ext}`);
  const output = path.join(global.tempDir || './tmp', `${Date.now()}.webp`);
  fs.writeFileSync(input, buffer);

  const options = [
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
