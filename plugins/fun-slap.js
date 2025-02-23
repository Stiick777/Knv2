let handler = async (m, { conn }) => {
    let who;

    if (m.isGroup) {
        who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender);
    } else {
        who = m.chat;
    }

    let name = await conn.getName(who);
    let name2 = await conn.getName(m.sender);

    await conn.sendMessage(m.chat, { react: { text: '👊🏻', key: m.key } });

    let str = `${name2} le dio una bofetada a ${who === m.sender ? 'sí mismo' : name} 🖐😵`.trim();

    let videos = [
        'https://telegra.ph/file/3ba192c3806b097632d3f.mp4',
        'https://telegra.ph/file/58b33c082a81f761bbee8.mp4',
        'https://telegra.ph/file/da5011a1c504946832c81.mp4',
        'https://telegra.ph/file/20ac5be925e6cd48f549f.mp4',
        'https://telegra.ph/file/a00bc137b0beeec056b04.mp4',
        'https://telegra.ph/file/080f08d0faa15119621fe.mp4',
        'https://telegra.ph/file/eb0b010b2f249dd189d06.mp4',
        'https://telegra.ph/file/734cb1e4416d80a299dac.mp4',
        'https://telegra.ph/file/fc494a26b4e46c9b147d2.mp4'
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

handler.help = ['bofetada @tag'];
handler.tags = ['fun'];
handler.command = ['slap', 'bofetada'];
handler.group = true;

export default handler;
