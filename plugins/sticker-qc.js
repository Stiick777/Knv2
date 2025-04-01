/* Codigo copiado de GataBot-MD */

/*import { sticker } from '../lib/sticker.js';
import axios from 'axios';
const handler = async (m, {conn, args, usedPrefix, command}) => {
let text
if (args.length >= 1) {
text = args.slice(0).join(" ");
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text;
} else return conn.reply(m.chat, '💡 Te Faltó El Texto!', m, );
if (!text) return conn.reply(m.chat, '💡 Te Faltó El Texto!', m, );
const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender; 
const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
const mishi = text.replace(mentionRegex, '');
if (mishi.length > 40) return conn.reply(m.chat, '⚠️ El texto no puede tener mas de 30 caracteres', m, );
const pp = await conn.profilePictureUrl(who).catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
const nombre = await conn.getName(who)
const obj = {"type": "quote", "format": "png", "backgroundColor": "#000000", "width": 512, "height": 768, "scale": 2, "messages": [{"entities": [], "avatar": true, "from": {"id": 1, "name": `${who?.name || nombre}`, "photo": {url: `${pp}`}}, "text": mishi, "replyMessage": {}}]};
const json = await axios.post('https://bot.lyo.su/quote/generate', obj, {headers: {'Content-Type': 'application/json'}});
const buffer = Buffer.from(json.data.result.image, 'base64');
let stiker = await sticker(buffer, false, global.packsticker, global.author);
if (stiker) return conn.sendFile(m.chat, stiker, 'error.webp', '', m);
}
handler.help = ['qc'];
handler.tags = ['sticker'];
handler.group = true;
handler.command = ['qc'];
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
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        return conn.reply(m.chat, '💡 Te faltó el texto!', m);
    }

    if (text.length > 40) {
        return conn.reply(m.chat, '⚠️ El texto no puede tener más de 40 caracteres', m);
    }

    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    const pp = await conn.profilePictureUrl(who).catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
    const nombre = await conn.getName(who);

    const obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": "#000000",
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "avatar": true,
            "from": { "id": 1, "name": nombre, "photo": { url: pp } },
            "text": text,
            "replyMessage": {}
        }]
    };

    const json = await axios.post('https://bot.lyo.su/quote/generate', obj, {
        headers: { 'Content-Type': 'application/json' }
    });
    
    const buffer = Buffer.from(json.data.result.image, 'base64');
    const webpBuffer = await toWebp(buffer);

    const sticker = new Sticker(webpBuffer, {
        pack: "", // No mostrar packname
        author: global.author || "Bot", // Solo mostrar autor
        type: StickerTypes.FULL
    });

    const finalSticker = await sticker.toBuffer();
    return conn.sendFile(m.chat, finalSticker, 'sticker.webp', '', m);
};

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = ['qc'];
handler.group = true;
export default handler;

async function toWebp(buffer) {
    const { ext } = await fromBuffer(buffer);
    if (!/(png|jpg|jpeg)/i.test(ext)) throw 'Media no compatible.';

    const input = path.join('./tmp', `${Date.now()}.${ext}`);
    const output = path.join('./tmp', `${Date.now()}.webp`);
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
