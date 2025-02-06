/*import fs from 'fs';

let handler = async (m, { conn }) => {
    // Asegurarnos de que la base de datos esté inicializada
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.marry) global.db.data.marry = {}; // Crear el objeto marry si no existe

    // Verificar si el usuario está casado
    let marriage = global.db.data.marry[m.sender];
    if (!marriage || marriage.status !== 'married' || !marriage.partner) {
        return await conn.sendMessage(m.chat, { 
            text: '❌ No estás casado con nadie por fe@, no puedes solicitar un divorcio.' 
        }, { quoted: m });
    }

    // Obtener la información del matrimonio
    let partnerId = marriage.partner; // ID de la pareja
    let name1 = conn.getName(m.sender) || 'Tú'; // Nombre del solicitante
    let name2 = partnerId ? (conn.getName(partnerId) || 'su pareja') : 'su pareja'; // Nombre de la pareja

    // Eliminar la información del matrimonio de ambos usuarios
    delete global.db.data.marry[m.sender];
    if (partnerId && global.db.data.marry[partnerId]) {
        delete global.db.data.marry[partnerId];
    }

    // Notificar el divorcio en el chat
    await conn.sendMessage(m.chat, { 
        text: `💔 ${name1} y ${name2} se han divorciado. Su matrimonio ha acabado 🥺.` 
    }, { quoted: m });

    // Notificar al otro usuario (la pareja) si es posible
    if (partnerId && partnerId !== m.sender) {
        await conn.sendMessage(partnerId, { 
            text: `💔 ${name1} ha solicitado el divorcio. Ya no están casados.` 
        });
    }
};

handler.help = ['divorce'];
handler.tags = ['fun'];
handler.command = ['divorce', 'divorcio'];
handler.group = true;

export default handler; */

import fs from 'fs';

let handler = async (m, { conn }) => {
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.marry) global.db.data.marry = {}; // Inicializar datos de matrimonio
    if (!global.db.data.divorced) global.db.data.divorced = {}; // Inicializar divorcios

    let marriage = global.db.data.marry[m.sender];
    let partnerId = marriage?.partner;

    if (!marriage || marriage.status !== 'married') {
        partnerId = Object.keys(global.db.data.marry).find(
            key => global.db.data.marry[key]?.partner === m.sender
        );

        if (!partnerId) {
            return await conn.sendMessage(m.chat, { 
                text: '❌ No estás casado con nadie por fe@, no puedes solicitar un divorcio.' 
            }, { quoted: m });
        }
    }

    // Obtener nombres
    let name1 = await conn.getName(m.sender) || 'Tú';
    let name2 = partnerId ? (await conn.getName(partnerId) || 'su pareja') : 'su pareja';

    // Calcular duración del matrimonio
    let startTime = marriage?.startTime;
    if (startTime) {
        let elapsedTime = Date.now() - startTime;
        global.db.data.divorced[m.sender] = { partner: partnerId, duration: elapsedTime };
        if (partnerId) {
            global.db.data.divorced[partnerId] = { partner: m.sender, duration: elapsedTime };
        }
    }

    // Eliminar registros de matrimonio
    delete global.db.data.marry[m.sender];
    if (partnerId) {
        delete global.db.data.marry[partnerId];
    }

    // Notificar en el chat
    await conn.sendMessage(m.chat, { 
        text: `💔 ${name1} y ${name2} se han divorciado. Su matrimonio ha acabado 😔.` 
    }, { quoted: m });

    // Notificar a la pareja
    if (partnerId && partnerId !== m.sender) {
        await conn.sendMessage(partnerId, { 
            text: `💔 ${name1} ha solicitado el divorcio. Ya no están casados nunca te amo 🥺.` 
        });
    }
};

handler.help = ['divorce'];
handler.tags = ['fun'];
handler.command = ['divorce', 'divorcio'];
handler.group = true;

export default handler;