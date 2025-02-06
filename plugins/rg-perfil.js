import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

var handler = async (m, { conn }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let ppUrl = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/wkMgN.jpg');
    let { premium, level, cookies, exp, registered, role } = global.db.data.users[who] || {};

    // Verificar matrimonio
    let marriage = global.db.data.marry[who]?.partner;
    let startTime = global.db.data.marry[who]?.startTime;
    let partnerName = marriage ? await conn.getName(marriage) : null;

    // Calcular tiempo de casados si están casados
    let durationText = '';
    if (marriage && startTime) {
        let elapsedTime = Date.now() - startTime;
        durationText = formatDuration(elapsedTime);
    }

    // Verificar si estuvieron casados antes (divorciados)
    let divorced = global.db.data.divorced[who];
    let divorcedText = '';
    if (divorced) {
        divorcedText = `💔 *Duración del matrimonio:* ${formatDuration(divorced.duration)}`;
    }

    let marriedText = marriage
        ? `💍 *Casad@ con:* ${partnerName} (@${marriage.replace(/@.+/, '')})\n💞 *Durante:* ${durationText}`
        : divorcedText || '💍 *Estado Civil:* Nadie te quiere 😹';

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
        let response = await fetch(ppUrl);
        if (!response.ok) throw new Error('Error al descargar la imagen');
        let ppBuffer = await response.buffer();

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

// Función para formatear duración en días, horas, minutos y segundos
function formatDuration(ms) {
    let seconds = Math.floor(ms / 1000) % 60;
    let minutes = Math.floor(ms / (1000 * 60)) % 60;
    let hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    let days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days} días, ${hours}h ${minutes}m ${seconds}s`;
}

handler.help = ['profile'];
handler.group = true;
handler.tags = ['rpg'];
handler.command = ['profile', 'perfil'];

export default handler;