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

    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

    let str = `${name2} nalgueó a ${who === m.sender ? 'sí mismo' : name} 🍑🔥`.trim();

    let videos = [
        'https://telegra.ph/file/d4b85856b2685b5013a8a.mp4',
        'https://telegra.ph/file/e278ca6dc7d26a2cfda46.mp4',
        'https://telegra.ph/file/f830f235f844e30d22e8e.mp4',
        'https://telegra.ph/file/07fe0023525be2b2579f9.mp4',
        'https://telegra.ph/file/99e036ac43a09e044a223.mp4'
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

handler.help = ['nalguear @tag'];
handler.tags = ['fun'];
handler.command = ['nalguear', 'ng'];
handler.group = true;

export default handler;
