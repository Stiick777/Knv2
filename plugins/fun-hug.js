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
    await m.react('🫂');

    let str = `${name2} abrazó a ${who === m.sender ? 'sí mismo' : name} 🥰`.trim();

    let videos = [
        'https://telegra.ph/file/56d886660696365f9696b.mp4',
        'https://telegra.ph/file/3e443a3363a90906220d8.mp4',
        'https://telegra.ph/file/6bc3cd10684f036e541ed.mp4',
        'https://telegra.ph/file/0e5b24907be34da0cbe84.mp4',
        'https://telegra.ph/file/6a3aa01fabb95e3558eec.mp4',
        'https://telegra.ph/file/5866f0929bf0c8fe6a909.mp4',
        'https://telegra.ph/file/436624e53c5f041bfd597.mp4',
        'https://telegra.ph/file/3eeadd9d69653803b33c6.mp4',
        "https://telegra.ph/file/4d80ab3a945a8446f0b15.mp4",
        "https://telegra.ph/file/ef3a13555dfa425fcf8fd.mp4",
        "https://telegra.ph/file/582e5049e4070dd99a995.mp4",
        "https://telegra.ph/file/ab57cf916c5169f63faee.mp4",
        "https://telegra.ph/file/fce96960010f6d7fc1670.mp4",
        "https://telegra.ph/file/33332f613e1ed024be870.mp4"
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

handler.help = ['abrazar @tag'];
handler.tags = ['fun'];
handler.command = ['hug', 'abrazar'];
handler.group = true;

export default handler;
