import fetch from 'node-fetch';
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
