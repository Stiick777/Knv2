/*

let handler = async (m, { conn }) => {
    // Aseguramos que la base de datos esté inicializada
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.marry) global.db.data.marry = {}; // Crear el objeto marry si no existe

    // Buscar la propuesta pendiente en este chat
    let marryData = Object.entries(global.db.data.marry).find(
        ([key, data]) => data.chatId === m.chat && data.status === 'pending' && data.proposer
    );

    if (!marryData) return; // No hay propuesta pendiente

    let proposer = marryData[1].proposer; // ID del proponente
    let chatId = marryData[1].chatId; // ID del chat

    // Verificar si el usuario que acepta ya está casado
    if (global.db.data.marry[m.sender]?.status === 'married') {
        return await conn.sendMessage(chatId, { text: 'Ya estás casado y no puedes aceptar otra propuesta 😒.' }, { quoted: m });
    }
    // Verificar si el proponente ya está casado
    if (global.db.data.marry[proposer]?.status === 'married') {
        return await conn.sendMessage(chatId, { text: `${conn.getName(proposer)} ya está casado y no puedes aceptar su propuesta 😒.` }, { quoted: m });
    }

    // Si el mensaje contiene "aceptar"
    if (m.text.toLowerCase() === 'aceptar') {
        // Registrar a ambos usuarios como casados
        global.db.data.marry[m.sender] = { status: 'married', partner: proposer }; // Quien acepta
        global.db.data.marry[proposer] = { status: 'married', partner: m.sender }; // Quien propone

        delete global.db.data.marry[m.sender]?.pending; // Eliminar estado pendiente para quien acepta
        delete global.db.data.marry[proposer]?.pending; // Eliminar estado pendiente para el proponente

        // Obtener nombres correctamente
        let nameProposer = await conn.getName(proposer); // Nombre del proponente
        let nameAccepter = await conn.getName(m.sender); // Nombre de quien acepta

        // Enviar mensaje de confirmación
        return await conn.sendMessage(chatId, {
            text: `${nameProposer} y ${nameAccepter} ahora están casados 💍 ¡Felicidades! 🥳`,
        }, { quoted: m });
    }

    // Si el mensaje contiene "rechazar"
    if (m.text.toLowerCase() === 'rechazar') {
        delete global.db.data.marry[proposer]; // Eliminar propuesta del proponente
        return await conn.sendMessage(chatId, { text: 'La propuesta de matrimonio ha sido rechazada porque no te ama 😖💔.' }, { quoted: m });
    }
};

handler.customPrefix = /^(aceptar|rechazar)$/i;
handler.command = new RegExp;

export default handler;
*/
let handler = async (m, { conn }) => {
    // Asegurar que la base de datos esté inicializada
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.marry) global.db.data.marry = {}; // Crear el objeto marry si no existe

    // Buscar la propuesta pendiente en este chat
    let marryData = Object.entries(global.db.data.marry).find(
        ([key, data]) => data.chatId === m.chat && data.status === 'pending' && data.proposer
    );

    if (!marryData) return; // No hay propuesta pendiente

    let proposer = marryData[1].proposer; // ID del proponente
    let recipient = marryData[0]; // ID del destinatario (persona a quien se propone)
    let chatId = marryData[1].chatId; // ID del chat

    // Verificar si la persona que responde es el destinatario de la propuesta
    if (m.sender !== recipient) {
        return await conn.sendMessage(chatId, { text: '⚠️ Solo la persona a la que se le propuso puede responder a esta propuesta.' }, { quoted: m });
    }

    // Verificar si el destinatario ya está casado
    if (global.db.data.marry[recipient]?.status === 'married') {
        return await conn.sendMessage(chatId, { text: '🤨 Ya estás casado y no puedes aceptar otra propuesta infiel.' }, { quoted: m });
    }

    // Verificar si el proponente ya está casado
    if (global.db.data.marry[proposer]?.status === 'married') {
        return await conn.sendMessage(chatId, { text: `😖 ${await conn.getName(proposer)} ya está casado y no puedes aceptar su propuesta.` }, { quoted: m });
    }

    // Si el mensaje contiene "aceptar"
    if (m.text.toLowerCase() === 'aceptar') {
        // ✅ Eliminar la propuesta pendiente del proponente antes de registrar el matrimonio
        delete global.db.data.marry[proposer];

        // Registrar a ambos usuarios correctamente
        global.db.data.marry[recipient] = { status: 'married', partner: proposer, chatId };
        global.db.data.marry[proposer] = { status: 'married', partner: recipient, chatId };

        // Obtener nombres correctamente
        let nameProposer = await conn.getName(proposer); // Nombre del proponente
        let nameRecipient = await conn.getName(recipient); // Nombre de quien acepta

        // Enviar mensaje de confirmación
        return await conn.sendMessage(chatId, {
            text: `💍 *${nameProposer} y ${nameRecipient} ahora están casados!* 💍\n🎉 ¡Felicidades! 🥳`,
        }, { quoted: m });
    }

    // Si el mensaje contiene "rechazar"
    if (m.text.toLowerCase() === 'rechazar') {
    // ✅ Eliminar la propuesta tanto del proponente como del destinatario
    delete global.db.data.marry[proposer];
    delete global.db.data.marry[recipient];

    return await conn.sendMessage(chatId, {
        text: '💔 La propuesta de matrimonio ha sido rechazada porque no te ama.',
    }, { quoted: m });
}
};

// Detectar los comandos "aceptar" y "rechazar"
handler.customPrefix = /^(aceptar|rechazar)$/i;
handler.command = new RegExp;

export default handler;