import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.reply(m.chat, `🍟 *Ingrese su petición*\n🚩 *Ejemplo de uso:* ${usedPrefix + command} Hola, ¿cómo estás?`, m, rcanal);
    }

    try {
        await m.react('💭');

        const response = await fetch('https://shinoa.us.kg/api/gpt/gpt3.5-Turbo', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'api_key': 'free',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        const data = await response.json();

        if (data.status) {
            await conn.reply(m.chat, `*Hola!👋 soy KanBot Provided By Stiiven*: ${data.data}`, m);
        } else {
            await conn.reply(m.chat, '🚩 Error: No se obtuvo una respuesta válida.', m);
        }
    } catch (error) {
        console.error('🚩 Error al obtener la respuesta:', error);
        await conn.reply(m.chat, 'Error: intenta más tarde.', m);
    }
};

handler.help = ['chatgpt <texto>', 'ia <texto>'];
handler.tags = ['ai'];
handler.command = ['ia', 'chatgpt'];
handler.group = true;

export default handler;