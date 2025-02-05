//BY STIIBEN

import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '*Por favor, ingresa el texto para el sticker.*', m);
    let text = args.join(' ');
 await m.reply('✨ *Creando attp maje Por favor, espere un momento.*')
    try {
        let res = await fetch(`https://widipe.com/attp?text=${encodeURIComponent(text)}`);
        let imgBuffer = await res.buffer();
        let stiker = await sticker(imgBuffer, false, global.packname, global.author);
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        } else {
            conn.reply(m.chat, '*No se pudo crear el sticker.*', m);
        }
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '*Ocurrió un error al crear el sticker.*', m);
    }
};

handler.help = ['attp <txt>'];
handler.tags = ['sticker'];
handler.command = ['attp'];

export default handler;
