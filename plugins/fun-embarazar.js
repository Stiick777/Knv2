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
    await m.react('😏');

    let str = `${name2} embarazó a ${who === m.sender ? 'sí mismo' : name} 😳`.trim();

    let videos = [
        'https://files.catbox.moe/054z2h.mp4',
        'https://files.catbox.moe/3ucfc0.mp4',
        'https://files.catbox.moe/brnwzh.mp4'
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

handler.help = ['embarazar @tag'];
handler.tags = ['fun'];
handler.command = ['preg', 'embarazar', 'preñar'];
handler.group = true;

export default handler;
