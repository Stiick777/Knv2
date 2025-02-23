import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('😏');

    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` embarazó a \`${name || who}\` (⊙_⊙;).`;
    } else if (m.quoted) {
        str = `\`${name2}\` embarazó a \`${name || who}\`.`;
    } else {
        str = `\`${name2}\` se embarazó a sí mismo (⊙_⊙;).`.trim();
    }
    
    if (m.isGroup) {
        let pp = 'https://files.catbox.moe/054z2h.mp4';
        let pp2 = 'https://files.catbox.moe/3ucfc0.mp4';
        let pp3 = 'https://files.catbox.moe/brnwzh.mp4';
        
        const videos = [pp, pp2, pp3];
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        let mentions = [who];
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
};

handler.help = ['embarazar @tag'];
handler.tags = ['fun'];
handler.command = ['preg', 'embarazar', 'preñar'];
handler.group = true;

export default handler;
