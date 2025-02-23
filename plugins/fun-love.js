import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    if (!who) throw 'Etiqueta o menciona a alguien';

    let user = global.db.data.users[who];
    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('😍');
    
    let str;
    if (m.mentionedJid.length > 0) {      
        str = `\`${name2}\` está enamorado de \`${name || who}\`.`;
    } else if (m.quoted) {      
        str = `\`${name2}\` está enamorado de \`${name || who}\`.`;
    } else {      
        str = `\`${name2}\` se enamoró de sí mismo ( ❤️ _ ❤️ ).`.trim();      
    }      
    
    if (m.isGroup){
    
    let pp = 'https://telegra.ph/file/5fbd60c40ab190ecc8e1c.mp4'
    let pp2 = 'https://telegra.ph/file/ca30d358d292674698b40.mp4'
    let pp3 = 'https://telegra.ph/file/25f88386dd7d4d6df36fa.mp4' 
    let pp4 = 'https://telegra.ph/file/eb63131df0de6b47c7ab7.mp4'
    let pp5 = 'https://telegra.ph/file/209990ee46c645506a5fc.mp4' 
    let pp6 = 'https://telegra.ph/file/440f276fcbb2d04cbf1d1.mp4'
    let pp7 = 'https://telegra.ph/file/42cea67d9b013ed9a9cd0.mp4' 
    let pp8 = 'https://telegra.ph/file/bc0f47b8f3fb9470bc918.mp4' 
    let pp9 = 'https://telegra.ph/file/79ae875090b64ab247b7a.mp4' 
    let pp10 = 'https://telegra.ph/file/63222faf293e9d086f607.mp4'
    const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10];
    const video = videos[Math.floor(Math.random() * videos.length)];
    conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption:str, mentions: [who] },{ quoted: m })
    }
}

handler.help = ['enamorada @tag'];
handler.tags = ['fun'];
handler.command = /^(love2|enamorado_de|enamorada_de)$/i;
handler.group = true;

export default handler;
