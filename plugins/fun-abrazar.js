import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix }) => {
    let who;

    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    } else {
        who = m.chat;
    }

    if (usedPrefix === 'a' || usedPrefix === 'A') return;

    let videos = [
        "https://telegra.ph/file/4d80ab3a945a8446f0b15.mp4",
        "https://telegra.ph/file/ef3a13555dfa425fcf8fd.mp4",
        "https://telegra.ph/file/582e5049e4070dd99a995.mp4",
        "https://telegra.ph/file/ab57cf916c5169f63faee.mp4",
        "https://telegra.ph/file/fce96960010f6d7fc1670.mp4",
        "https://telegra.ph/file/33332f613e1ed024be870.mp4"
    ];

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    try {
        const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
        const mentionUser = who === m.sender ? taguser : '@' + who.split('@')[0];

        const str = `${taguser} le está dando un fuerte abrazo a ${mentionUser} 🫂`;

        await conn.sendMessage(m.chat, {
            video: { url: randomVideo },
            gifPlayback: true,
            caption: str.trim(),
            mentions: [m.sender, who]
        }, { quoted: m });

    } catch (e) {
        await conn.reply(m.chat, '❌ *¡Ocurrió un error!*', m);
    }
};

handler.help = ['abrazar <@usuario>'];
handler.tags = ['fun'];
handler.command = ['abrazar'];
handler.group = true;

export default handler;
