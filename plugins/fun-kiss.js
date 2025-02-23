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

    // Reacción de corazón
    await conn.sendMessage(m.chat, { react: { text: '❤', key: m.key } });

    let str = `${name2} le dio besos a ${who === m.sender ? 'sí mismo' : name} 😘`.trim();

    let videos = [
        'https://telegra.ph/file/d6ece99b5011aedd359e8.mp4',
        'https://telegra.ph/file/ba841c699e9e039deadb3.mp4',
        'https://telegra.ph/file/6497758a122357bc5bbb7.mp4',
        'https://telegra.ph/file/8c0f70ed2bfd95a125993.mp4',
        'https://telegra.ph/file/826ce3530ab20b15a496d.mp4',
        'https://telegra.ph/file/f66bcaf1effc14e077663.mp4',
        'https://telegra.ph/file/e1dbfc56e4fcdc3896f08.mp4',
        'https://telegra.ph/file/0fc525a0d735f917fd25b.mp4',
        'https://telegra.ph/file/68643ac3e0d591b0ede4f.mp4',
        'https://telegra.ph/file/af0fe6eb00bd0a8a9e3a0.mp4'
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

handler.help = ['besar @tag'];
handler.tags = ['fun'];
handler.command = ['kiss', 'beso', 'besar'];
handler.group = true;

export default handler;
