let handler = async (m, { conn }) => {
    let who;

    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    } else {
        who = m.chat;
    }

    let name = await conn.getName(who);
    let name2 = await conn.getName(m.sender);

    await conn.sendMessage(m.chat, { react: { text: '😶', key: m.key } });

    let str = `${name2} le está haciendo pucheros a ${who === m.sender ? 'sí mismo' : name} 😭`.trim();

    let videos = [
        'https://telegra.ph/file/e2a25adcb74689a58bcc6.mp4',
        'https://telegra.ph/file/5239f6f8837383fa5bf2d.mp4',
        'https://telegra.ph/file/63564769ec715d3b6379d.mp4',
        'https://telegra.ph/file/06f7458e3a6a19deb5173.mp4',
        'https://telegra.ph/file/cdd5e7db98e1d3a46231a.mp4',
        'https://telegra.ph/file/070e2c38c9569a764cc10.mp4',
        'https://telegra.ph/file/c1834a34cd0edfd2bdbe1.mp4',
        'https://telegra.ph/file/4ceafdd813e727548cb2f.mp4',
        'https://telegra.ph/file/7aa2790c3eba5b27416ce.mp4',
        'https://telegra.ph/file/ec2d25e70b165a19e7ef7.mp4'
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

handler.help = ['pucheros @tag'];
handler.tags = ['fun'];
handler.command = ['pout', 'pucheros'];
handler.group = true;

export default handler;
