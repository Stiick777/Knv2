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
    await m.react('😹');

    let str = `${name2} se está riendo de ${who === m.sender ? 'sí mismo' : name} 😂`.trim();

    let videos = [
        'https://telegra.ph/file/5fa4fd7f4306aa7b2e17a.mp4',
        'https://telegra.ph/file/b299115a77fadb7594ca0.mp4',
        'https://telegra.ph/file/9938a8c2e54317d6b8250.mp4',
        'https://telegra.ph/file/e6c7b3f7d482ae42db9a7.mp4',
        'https://telegra.ph/file/a61b52737df7459580129.mp4',
        'https://telegra.ph/file/f34e1d5c8f17bd2739a51.mp4',
        'https://telegra.ph/file/c345ed1ca18a53655f857.mp4',
        'https://telegra.ph/file/4eec929f54bc4d83293a3.mp4',
        'https://telegra.ph/file/856e38b2303046990531c.mp4'
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

handler.help = ['reirse @tag'];
handler.tags = ['fun'];
handler.command = ['laugh', 'reirse'];
handler.group = true;

export default handler;
