import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.reply(m.chat, `💡 *Ingrese su petición*\n⚡ *Ejemplo de uso:* ${usedPrefix + command} Hola, ¿cómo estás?`, m, rcanal);
    }

    try {
        await m.react('💭');

        const payload = [
            {
                role: 'system',
                content: text
            }
        ];

        const response = await fetch('https://api.siputzx.my.id/api/ai/gpt3', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.status && data.data) {
            await conn.reply(m.chat, `*KanBot Segun chatgpt:*\n${data.data}`, m);
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
