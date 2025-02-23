import fs from 'fs';
import path from 'path';
import uploadImage from '../lib/uploadImage.js';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }
    
    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });
    
    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` nalgueó a \`${name || who}\``;
    } else if (m.quoted) {
        str = `\`${name2}\` nalgueó a \`${name || who}\``;
    } else {
        str = `\`${name2}\` se nalgueó a sí mismo ( ⚆ _ ⚆ ).`;
    }
    
    if (m.isGroup) {
        let pp = 'https://telegra.ph/file/d4b85856b2685b5013a8a.mp4';
        let pp2 = 'https://telegra.ph/file/e278ca6dc7d26a2cfda46.mp4';
        let pp3 = 'https://telegra.ph/file/f830f235f844e30d22e8e.mp4';
        let pp4 = 'https://telegra.ph/file/07fe0023525be2b2579f9.mp4';
        let pp5 = 'https://telegra.ph/file/99e036ac43a09e044a223.mp4';
        
        const videos = [pp, pp2, pp3, pp4, pp5];
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions: [who] }, { quoted: m });
    }
};

handler.help = ['violar @tag'];
handler.tags = ['fun'];
handler.command = ['nalguear'];
handler.group = true;

export default handler;
