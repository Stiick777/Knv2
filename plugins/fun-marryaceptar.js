let handler = async (m, { conn }) => {
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.marry) global.db.data.marry = {};
    if (!global.db.data.marryTimers) global.db.data.marryTimers = {};

    let marryData = Object.entries(global.db.data.marry).find(
        ([key, data]) => data.chatId === m.chat && data.status === 'pending' && data.proposer
    );

    if (!marryData) return; // No hay propuesta pendiente

    let proposer = marryData[1].proposer;
    let recipient = marryData[0];
    let chatId = marryData[1].chatId;

    if (m.sender !== recipient) {
        return await conn.sendMessage(chatId, { 
            text: '⚠️ Solo la persona a la que se le propuso puede responder a esta propuesta.' 
        }, { quoted: m });
    }

    if (global.db.data.marry[recipient]?.status === 'married') {
        return await conn.sendMessage(chatId, { 
            text: '🤨 Ya estás casado y no puedes aceptar otra propuesta.' 
        }, { quoted: m });
    }

    if (global.db.data.marry[proposer]?.status === 'married') {
        return await conn.sendMessage(chatId, { 
            text: `😖 ${await conn.getName(proposer)} ya está casado.` 
        }, { quoted: m });
    }

    if (m.text.toLowerCase() === 'aceptar') {
        if (global.db.data.marryTimers[recipient]) {
            clearTimeout(global.db.data.marryTimers[recipient]);
            delete global.db.data.marryTimers[recipient];
        }

        let startTime = Date.now();
        global.db.data.marry[recipient] = { status: 'married', partner: proposer, chatId, startTime };
        global.db.data.marry[proposer] = { status: 'married', partner: recipient, chatId, startTime };

        let nameProposer = await conn.getName(proposer);
        let nameRecipient = await conn.getName(recipient);

        return await conn.sendMessage(chatId, {  
            text: `💍 *${nameProposer} y ${nameRecipient} ahora están casados!* 🎉`,  
        }, { quoted: m });
    }

    if (m.text.toLowerCase() === 'rechazar') {
        if (global.db.data.marryTimers[recipient]) {
            clearTimeout(global.db.data.marryTimers[recipient]);
            delete global.db.data.marryTimers[recipient];
        }

        delete global.db.data.marry[proposer];
        delete global.db.data.marry[recipient];

        return await conn.sendMessage(chatId, {  
            text: '💔 La propuesta de matrimonio ha sido rechazada.',  
        }, { quoted: m });
    }
};

handler.customPrefix = /^(aceptar|rechazar)$/i;
handler.command = new RegExp;

export default handler;