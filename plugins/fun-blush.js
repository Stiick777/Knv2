import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    let who;

    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    } else {
        who = m.chat;
    }

    let name = await conn.getName(who);
    let name2 = await conn.getName(m.sender);
    await m.react('🤭');

    let str = `${name2} se sonrojó por ${who === m.sender ? 'sí mismo' : name}`.trim();

    let videos = [
        'https://telegra.ph/file/a4f925aac453cad828ef2.mp4',
        'https://telegra.ph/file/f19318f1e8dad54303055.mp4',
        'https://telegra.ph/file/15605caa86eee4f924c87.mp4',
        'https://telegra.ph/file/d301ffcc158502e39afa7.mp4',
        'https://telegra.ph/file/c6105160ddd3ca84f887a.mp4',
        'https://telegra.ph/file/abd44f64e45c3f30442bd.mp4',
        'https://telegra.ph/file/9611e5c1d616209bc0315.mp4'
    ];

    const video = videos[Math.floor(Math.random() * videos.length)];

    try {
        await conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: [m.sender, who]
        }, { quoted: m });
    } catch (e) {
        await conn.reply(m.chat, '🍟 *¡Ocurrió un error!*', m);
    }
};

handler.help = ['sonrojarse @tag'];
handler.tags = ['fun'];
handler.command = ['blush', 'sonrojarse'];
handler.group = true;

export default handler;
