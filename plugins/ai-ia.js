import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.reply(m.chat, `💡 *Ingrese su petición*\n⚡ *Ejemplo de uso:* ${usedPrefix + command} Hola, ¿cómo estás?`, m, rcanal);
    }

    try {
        await m.react('💭');

        // Usar la nueva API
        const response = await fetch(`https://vapis.my.id/api/openai?q=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (data.status) {
            // Responder con el mensaje fijo en lugar de la respuesta de OpenAI
            await conn.reply(m.chat, `*Hola!👋 soy KanBot Provided By Stiiven*:\n${data.result}`, m);
        } else {
            await m.react('❌');
            await conn.reply(m.chat, '❌ Error: No se obtuvo una respuesta válida.', m, rcanal);
        }
    } catch (error) {
        await m.react('❌');
        console.error('❌ Error al obtener la respuesta:', error);
        await conn.reply(m.chat, 'Error: intenta más tarde.', m, rcanal);
    }
};

handler.help = ['ia <texto>'];
handler.tags = ['ai'];
handler.command = ['ia', 'chatgpt'];
handler.group = true;

export default handler;
