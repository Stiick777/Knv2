import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    let who;
    
    // Verificamos si se menciona a alguien o se cita un mensaje
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]; // Si hay mención, usamos esa
    } else if (m.quoted) {
        who = m.quoted.sender; // Si se cita un mensaje, usamos el emisor de ese mensaje
    } else {
        who = m.sender; // En caso contrario, usamos el emisor
    }

    let name = await conn.getName(who);
    let name2 = await conn.getName(m.sender);
    await m.react('🗡️');

    // Construimos el mensaje dependiendo de la acción
    let str = m.sender === who 
        ? `\`${name2}\` se mató a sí mismo ( ⚆ _ ⚆ ).` 
        : `\`${name2}\` mató a \`${name}\` ( ⚆ _ ⚆ ).`;

    let videos = [
        'https://qu.ax/GQLO.mp4',
        'https://qu.ax/bzFY.mp4',
        'https://qu.ax/OQFE.mp4',
        'https://qu.ax/GssX.mp4',
        'https://qu.ax/NeQYU.mp4',
        'https://qu.ax/ypqXb.mp4',
        'https://qu.ax/rxME.mp4',
        'https://qu.ax/mNLhE.mp4',
        'https://qu.ax/WVjPF.mp4'
    ];

    const video = videos[Math.floor(Math.random() * videos.length)];

    try {
        await conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: [who]
        }, { quoted: m });
    } catch (e) {
        await conn.reply(m.chat, '⚠️ *¡Ocurrió un error al enviar el video!*', m);
    }
};

handler.help = ['kill/matar @tag'];
handler.tags = ['fun'];
handler.command = ['kill', 'matar'];
handler.group = true;

export default handler;
