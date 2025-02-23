let handler = async (m, { conn }) => {
    let who;

    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    } else {
        who = m.chat;
    }

    if (!who) throw 'Etiqueta o menciona a alguien.';

    let name = await conn.getName(who);
    let name2 = await conn.getName(m.sender);

    await conn.sendMessage(m.chat, { react: { text: '😱', key: m.key } });

    let str = `${name2} está asustado(a) de ${who === m.sender ? 'sí mismo' : name} 😨👀`.trim();

    let videos = [
        'https://telegra.ph/file/9c1e963fa4d8269fb17a7.mp4',
        'https://telegra.ph/file/0c802b4fa616aaf1da229.mp4',
        'https://telegra.ph/file/d0b166d9a363765e51657.mp4',
        'https://telegra.ph/file/eae6dd9d45e45fe3a95ab.mp4',
        'https://telegra.ph/file/1785e535a4463c2a337c5.mp4',
        'https://telegra.ph/file/9774e1d74c3abf083ae01.mp4',
        'https://telegra.ph/file/c1673b418bc61db1e51a0.mp4',
        'https://telegra.ph/file/dcde646a58d8e9bf44867.mp4'
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

handler.help = ['scared @tag'];
handler.tags = ['fun'];
handler.command = ['scared', 'asustada'];
handler.group = true;

export default handler;
