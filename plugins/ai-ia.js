
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `💡 *Ingrese su petición*\n⚡ *Ejemplo de uso:* ${usedPrefix + command} Hola, ¿cómo estás?`,
            m,
            rcanal
        );
    }

    try {
        await m.react('💭');

        const response = await fetch(`https://api.delirius.store/ia/chatgpt?q=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (data.status && data.data) {
            await conn.reply(
                m.chat,
                `*KanBot según ChatGPT:*\n\n${data.data}`,
                m
            );
        } else {
            await m.react('❌');
            await conn.reply(
                m.chat,
                '❌ Error: No se obtuvo una respuesta válida.',
                m,
                rcanal
            );
        }

    } catch (error) {
        await m.react('❌');
        console.error('❌ Error al obtener la respuesta:', error);
        await conn.reply(
            m.chat,
            'Error: intenta más tarde.',
            m,
            rcanal
        );
    }
};

handler.help = ['ia <texto>'];
handler.tags = ['ai'];
handler.command = ['ia', 'chatgpt'];
handler.group = true;

export default handler;
