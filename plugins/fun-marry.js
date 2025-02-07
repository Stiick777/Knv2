import fs from 'fs';

let handler = async (m, { conn, usedPrefix }) => {
    // Asegurar que la base de datos esté inicializada
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.marry) global.db.data.marry = {};

    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else {
        who = m.chat;
    }

    if (!who) {
        return await conn.sendMessage(m.chat, { 
            text: 'Etiqueta o menciona a alguien para proponer matrimonio 👰🏻‍♀' 
        }, { quoted: m });
    }

    // Asegurar que el destinatario tiene el formato correcto
    who = who.replace(/@/g, '') + '@s.whatsapp.net';

    // Verificar si el proponente ya está casado
    if (global.db.data.marry[m.sender]?.status === 'married') {
        let partner = global.db.data.marry[m.sender].partner;
        let namePartner = await conn.getName(partner);
        return await conn.sendMessage(m.chat, { 
            text: `🤨 Ya estás casado con ${namePartner}. No puedes hacer otra propuesta, infiel.` 
        }, { quoted: m });
    }

    // Verificar si el destinatario ya está casado
    if (global.db.data.marry[who]?.status === 'married') {
        let partner = global.db.data.marry[who].partner;
        let namePartner = await conn.getName(partner);
        let nameRecipient = await conn.getName(who);

        return await conn.sendMessage(m.chat, { 
            text: `☹️ ${nameRecipient} ya está casado con ${namePartner}. No puedes proponerle matrimonio.` 
        }, { quoted: m });
    }

    // Verificar si el destinatario ya tiene una propuesta pendiente
    if (global.db.data.marry[who]?.status === 'pending') {
        return await conn.sendMessage(m.chat, { 
            text: '⚠️ Esta persona ya tiene una propuesta pendiente. Espera a que la responda.' 
        }, { quoted: m });
    }

    // Verificar si el proponente ya tiene una propuesta pendiente
    if (global.db.data.marry[m.sender]?.status === 'pending') {
        return await conn.sendMessage(m.chat, { 
            text: '⚠️ Ya has hecho una propuesta de matrimonio. Espera a que sea aceptada o rechazada antes de hacer otra.' 
        }, { quoted: m });
    }

    // Guardar la propuesta en la base de datos
    global.db.data.marry[who] = {
        proposer: m.sender,
        chatId: m.chat,
        status: 'pending',
        timestamp: Date.now(),
    };

    // Obtener nombres de los usuarios
    let nameProposer = await conn.getName(m.sender);
    let nameRecipient = await conn.getName(who);

    // Enviar la propuesta con una imagen
    const imageUrl = 'https://qu.ax/PUKkD.jpg';
    await conn.sendFile(
        m.chat, 
        imageUrl, 
        'propuesta.jpg', 
        `💍 *${nameProposer} ha propuesto matrimonio a ${nameRecipient}.* 🎉\n💌 Responde con *"aceptar"* o *"rechazar"* en los próximos 5 minutos.`,
        m,
        { mentions: [m.sender, who] }
    );

    // Establecer un tiempo límite para la respuesta (5 minutos)
    let timeoutId = setTimeout(async () => {
        if (global.db.data.marry[who]?.status === 'pending') {
            delete global.db.data.marry[who];

            await conn.sendMessage(m.chat, { 
                text: `😢 La propuesta de matrimonio a ${nameRecipient} ha sido cancelada por falta de respuesta, duda de tu amor.` 
            }, { quoted: m });
        }
    }, 5 * 60 * 1000); // 5 minutos

    // Guardar el timeoutId para poder cancelarlo si es necesario
    global.db.data.marry[who].timeoutId = timeoutId;
};

handler.help = ['marry @usuario'];
handler.tags = ['fun'];
handler.command = ['marry', 'propose'];
handler.group = true;

export default handler;