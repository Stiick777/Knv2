let handler = async (m, { conn }) => {
    let who;

    if (m.isGroup) {
        who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender);
    } else {
        who = m.chat;
    }

    let name = await conn.getName(who);
    let name2 = await conn.getName(m.sender);

    await conn.sendMessage(m.chat, { react: { text: '😶‍🌫️', key: m.key } });

    let str = `${name2} está tímido(a) por ${who === m.sender ? 'sí mismo' : name} 😳💦`.trim();

    let videos = [
        'https://telegra.ph/file/a9ccfa5013d58fad2e677.mp4',
        'https://telegra.ph/file/2cd355afa143095b97890.mp4',
        'https://telegra.ph/file/362c8566dc9367a5a473d.mp4',
        'https://telegra.ph/file/4f9323ca22e126b9d275c.mp4',
        'https://telegra.ph/file/51b688e0c5295bc37ca92.mp4',
        'https://telegra.ph/file/dfe74d7eee02c170f6f55.mp4',
        'https://telegra.ph/file/697719af0e6f3baec4b2f.mp4',
        'https://telegra.ph/file/89e1e1e44010975268b38.mp4',
        'https://telegra.ph/file/654313ad5a3e8b43fc535.mp4'
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

handler.help = ['timida @tag'];
handler.tags = ['fun'];
handler.command = ['shy', 'timido'];
handler.group = true;

export default handler;
