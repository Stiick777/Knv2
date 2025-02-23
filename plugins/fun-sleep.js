let handler = async (m, { conn }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender);
    } else {
        who = m.chat;
    }

    let name = await conn.getName(who);
    let name2 = await conn.getName(m.sender);

    await conn.sendMessage(m.chat, { react: { text: '😴', key: m.key } });

    let str = `${name2} está durmiendo con ${who === m.sender ? 'sí mismo' : name} 💤`.trim();

    let videos = [
        'https://telegra.ph/file/0684477ff198a678d4821.mp4',
        'https://telegra.ph/file/583b7a7322fd6722751b5.mp4',
        'https://telegra.ph/file/e6ff46f4796c57f2235bd.mp4',
        'https://telegra.ph/file/06b4469cd5974cf4e28ff.mp4',
        'https://telegra.ph/file/9213f74b91f8a96c43922.mp4',
        'https://telegra.ph/file/b93da0c01981f17c05858.mp4',
        'https://telegra.ph/file/8e0b0fe1d653d6956608a.mp4',
        'https://telegra.ph/file/3b091f28e5f52bc774449.mp4',
        'https://telegra.ph/file/7c795529b38d1a93395f6.mp4',
        'https://telegra.ph/file/6b8e6cc26de052d4018ba.mp4'
    ];

    const video = videos[Math.floor(Math.random() * videos.length)];

    try {
        await conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: who === m.sender ? [m.sender] : [m.sender, who]
        }, { quoted: m });
    } catch (e) {
        await conn.reply(m.chat, '⚠️ *¡Ocurrió un error al enviar el video!*', m);
    }
};

handler.help = ['dormir @tag'];
handler.tags = ['fun'];
handler.command = ['sleep', 'dormir'];
handler.group = true;

export default handler;
