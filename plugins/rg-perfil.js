import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

var handler = async (m, { conn }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let ppUrl = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/wkMgN.jpg'); // Imagen predeterminada
    let { premium, level, cookies, exp, registered, role } = global.db.data.users[who] || {};

    // Verificar si el usuario está casado y obtener el nombre de su pareja
    let marriage = global.db.data.marry[who]?.partner;
    let partnerName = marriage ? await conn.getName(marriage) : null;
    
    let marriedText = marriage
        ? `💍 *Casad@ con:* ${partnerName} (@${marriage.replace(/@.+/, '')})`
        : '💍 *Estado Civil:* Nadie te quiere 😹';

    let username = await conn.getName(who);

    let profileText = `
🚩 *PERFIL DE USUARIO*
☁️ *Nombre:* ${username}
💥 *Tag:* @${who.replace(/@.+/, '')}
${marriedText}

👑 *RECURSOS*
💥 *Nivel:* ${level || 0}
💫 *Experiencia:* ${exp || 0}
✨️ *Rango:* ${role || 'Sin rango'}

*_Provided by KanBot_*
`.trim();

    try {
        // Descargar la imagen de perfil como Buffer
        let response = await fetch(ppUrl);
        if (!response.ok) throw new Error('Error al descargar la imagen');
        let ppBuffer = await response.buffer();

        // Enviar la imagen con el perfil
        await conn.sendFile(
            m.chat,
            ppBuffer,
            'perfil.jpg',
            profileText,
            m,
            null,
            { mentions: [who, marriage].filter(Boolean) }
        );
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: 'Hubo un error al obtener la imagen de perfil.' }, { quoted: m });
    }
};

handler.help = ['profile'];
handler.group = true;
handler.tags = ['rpg'];
handler.command = ['profile', 'perfil'];

export default handler;