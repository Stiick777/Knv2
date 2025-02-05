let handler = async (m, { conn, text }) => {
    // Verificamos si el mensaje es una respuesta (quoted message)
    let number = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    let url = await conn.profilePictureUrl(number, 'image').catch(_ => 'https://telegra.ph/file/981dd23869e6d71325dfe.jpg');

    await m.react('🕓');
    await conn.sendFile(m.chat, url, 'thumbnail.jpg', '', m, null, rcanal);
    await m.react('✅');
};

handler.help = ['pp'];
handler.tags = ['tools'];
handler.command = /^pp$/i;  

export default handler;
