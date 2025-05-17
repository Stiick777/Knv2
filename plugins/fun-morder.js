import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    if (!who) throw 'Etiqueta o menciona a alguien';

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    await conn.sendMessage(m.chat, { react: { text: '😾', key: m.key } });

    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` mordio a \`${name || who}\`.`;
    } else if (m.quoted) {
        str = `\`${name2}\` mordio a \`${name || who}\`.`;
    } else {
        str = `\`${name2}\` se mordio a sí mismo ( ⚆ _ ⚆ ).`.trim();
    }

    if (m.isGroup) {
        let pp = 'https://files.catbox.moe/zsovfx.mp4';
        let pp2 = 'https://files.catbox.moe/g0jfq7.mp4';
        let pp3 = 'https://files.catbox.moe/m94q5i.mp4';
        let pp4 = 'https://files.catbox.moe/77vbwy.mp4';
        let pp5 = 'https://files.catbox.moe/9i63rq.mp4';
        let pp6 = 'https://files.catbox.moe/bw9qqd.mp4';
        let pp7 = 'https://files.catbox.moe/a8e6j2.mp4';
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7];
        const video = videos[Math.floor(Math.random() * videos.length)];
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions: [who] }, { quoted: m });
    }
}

handler.help = ['morder @tag'];
handler.tags = ['fun'];
handler.command = ['morder'];
handler.group = true;

export default handler;