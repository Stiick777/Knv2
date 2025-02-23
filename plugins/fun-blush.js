import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    if (!who) return conn.sendMessage(m.chat, { text: 'Etiqueta o menciona a alguien' });

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('🤭');
    
    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` se sonrojó por \`${name || who}\``;
    } else if (m.quoted) {
        str = `\`${name2}\` se sonrojó por \`${name || who}\``;
    } else {
        str = `\`${name2}\` se sonrojó solo.`.trim();
    }
    
    if (m.isGroup) {
        let pp = 'https://qu.ax/GQLO.mp4';
        let pp2 = 'https://qu.ax/bzFY.mp4';
        let pp3 = 'https://qu.ax/OQFE.mp4';
        let pp4 = 'https://qu.ax/GQLO.mp4';
        let pp5 = 'https://qu.ax/GssX.mp4';
        let pp6 = 'https://qu.ax/NeQYU.mp4';
        let pp7 = 'https://qu.ax/ypqXb.mp4';
        let pp8 = 'https://qu.ax/rxME.mp4';
        let pp9 = 'https://qu.ax/mNLhE.mp4';
        let pp10 = 'https://qu.ax/WVjPF.mp4';
                 
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10];
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions: [who] }, { quoted: m });
    }
}

handler.help = ['sonrojarse @tag'];
handler.tags = ['fun'];
handler.command = ['blush','sonrojarse'];
handler.group = true;

export default handler;
