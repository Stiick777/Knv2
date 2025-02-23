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
    await m.react('😋');

    let str = `${name2} lamió a ${who === m.sender ? 'sí mismo' : name} 🤤`.trim();

    let videos = [
        'https://telegra.ph/file/0ce171b163a669ae9819d.mp4',
        'https://telegra.ph/file/b80fdfb8551b66f77b67e.mp4',
        'https://telegra.ph/file/f87d442b78389d4ed5be0.mp4',
        'https://telegra.ph/file/74828e36617c16421598f.mp4',
        'https://telegra.ph/file/093cbdd990220446d8920.mp4',
        'https://telegra.ph/file/5042d5f627a3500e2fe8e.mp4',
        'https://telegra.ph/file/02ec493403335917d1ece.mp4',
        'https://telegra.ph/file/a0a86516033a906b55220.mp4',
        'https://telegra.ph/file/570944813cab1c9dddd03.mp4'
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
        await conn.reply(m.chat, '⚠️ *¡Ocurrió un error al enviar el video!*', m);
    }
};

handler.help = ['lamber @tag'];
handler.tags = ['fun'];
handler.command = ['lick', 'lamer', 'lamber'];
handler.group = true;

export default handler;
