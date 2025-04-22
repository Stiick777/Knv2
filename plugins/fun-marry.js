/*import fs from 'fs';

let handler = async (m, { conn, usedPrefix }) => {
    // Asegúrate de que la base de datos esté inicializada
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.marry) global.db.data.marry = {}; // Crear el objeto marry si no existe

    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    if (!who) return await conn.sendMessage(m.chat, { text: 'Etiqueta o menciona a alguien' }, { quoted: m });

    // Verificar si ambos usuarios ya están casados
    if (global.db.data.marry[m.sender]?.status === 'married') {
        return await conn.sendMessage(m.chat, { text: 'Ya estás casado y no puedes proponer matrimonio.' }, { quoted: m });
    }
    if (global.db.data.marry[who]?.status === 'married') {
        return await conn.sendMessage(m.chat, { text: `${conn.getName(who)} ya está casado y no puede recibir propuestas de matrimonio.` }, { quoted: m });
    }

    // Verificar si ya hay una propuesta pendiente para el usuario
    let user = global.db.data.marry[who];
    if (user && user.status === 'pending') {
        return await conn.sendMessage(m.chat, { text: 'Esta persona ya tiene una propuesta pendiente.' }, { quoted: m });
    }

    // Almacenar la propuesta en la base de datos
    global.db.data.marry[who] = {
        proposer: m.sender,
        chatId: m.chat,
        status: 'pending', // Estado pendiente
        timestamp: Date.now(), // Momento de la propuesta
    };

    let name1 = conn.getName(m.sender);
    let name2 = conn.getName(who);
    await conn.sendMessage(m.chat, {
        text: `${name1} ha propuesto matrimonio a ${name2}. Responde "aceptar" o "rechazar" en los próximos 5 minutos.`,
        mentions: [m.sender, who],
    }, { quoted: m });

    // Establecer un tiempo límite para la respuesta
    setTimeout(() => {
        if (global.db.data.marry[who] && global.db.data.marry[who].status === 'pending') {
            delete global.db.data.marry[who];
            conn.sendMessage(m.chat, { text: 'La propuesta de matrimonio ha sido cancelada por falta de respuesta.' }, { quoted: m });
        }
    }, 5 * 60 * 1000); // 5 minutos
};

handler.help = ['marry @usuario'];
handler.tags = ['fun'];
handler.command = ['marry', 'propose'];
handler.group = true;

export default handler; 
*/

import fs from 'fs';

let handler = async (m, { conn, usedPrefix }) => {
    // Asegúrate de que la base de datos esté inicializada
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.marry) global.db.data.marry = {};

    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;

    // Verificar si el proponente (m.sender) ya está casado
    if (global.db.data.marry[m.sender]?.status === 'married') {
        let partner = global.db.data.marry[m.sender].partner;
        let namePartner = await conn.getName(partner); // Obtener nombre del compañero
        return await conn.sendMessage(m.chat, { 
            text: `🤨 Ya estás casado con ${namePartner}. No puedes hacer otra propuesta infiel.` 
        }, { quoted: m });
    }

    // Si no se menciona a nadie, usar el chat como destinatario
    if (!who) {
        return await conn.sendMessage(m.chat, { 
            text: 'Etiqueta o menciona a alguien para proponer matrimonio 👰🏻‍♀' 
        }, { quoted: m });
    }

    // Verificar si el destinatario (who) ya está casado
if (global.db.data.marry[who]?.status === 'married') {
    let partner = global.db.data.marry[who].partner;
    let namePartner = await conn.getName(partner); // Obtener nombre del compañero
    let nameRecipient = await conn.getName(who); // Obtener nombre del destinatario

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
        status: 'pending', // Estado de la propuesta
        timestamp: Date.now(),
    };

    // Obtener nombres de los usuarios involucrados
    let nameProposer = await conn.getName(m.sender); // Nombre del proponente
    let nameRecipient = await conn.getName(who); // Nombre del destinatario

    // Enviar imagen con la propuesta
    const imageUrl = 'https://i.ibb.co/xtPJLdRD/images.jpg';
    await conn.sendFile(
        m.chat, 
        imageUrl, 
        'propuesta.jpg', 
        `💍 *${nameProposer} ha propuesto matrimonio a ${nameRecipient}.* 🎉\n💌 Responde con *"aceptar"* o *"rechazar"* en los próximos 5 minutos.`,
        m,
        { mentions: [m.sender, who] }
    );

    // Establecer un tiempo límite para la respuesta (5 minutos)
    setTimeout(async () => {
        if (global.db.data.marry[who]?.status === 'pending') {
            // Eliminar la propuesta de matrimonio después de 5 minutos
            delete global.db.data.marry[who];

            await conn.sendMessage(m.chat, { 
                text: `😢 La propuesta de matrimonio a ${nameRecipient} ha sido cancelada por falta de respuesta duda de tu amor.` 
            }, { quoted: m });
        }
    }, 5 * 60 * 1000); // 5 minutos
};

handler.help = ['marry @usuario'];
handler.tags = ['fun'];
handler.command = ['marry', 'propose'];
handler.group = true;

export default handler;
