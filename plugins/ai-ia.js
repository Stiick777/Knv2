import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.reply(m.chat, `💡 *Ingrese su petición*\n⚡ *Ejemplo de uso:* ${usedPrefix + command} Hola, ¿cómo estás?`, m);
    }

    try {
        await m.react('💭');

        const response = await fetch(`https://restapi.apibotwa.biz.id/api/chatgpt?message=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (data.status === 200 && data.data?.response) {
            await conn.reply(m.chat, `*Hola!👋 soy KanBot Provided By Stiiven*:\n${data.data.response}`, m);
        } else {
            await m.react('❌');
            await conn.reply(m.chat, '❌ Error: No se obtuvo una respuesta válida.', m);
        }
    } catch (error) {
        await m.react('❌');
        console.error('❌ Error al obtener la respuesta:', error);
        await conn.reply(m.chat, 'Error: intenta más tarde.', m);
    }
};

handler.help = ['ia <texto>'];
handler.tags = ['ai'];
handler.command = ['ia', 'chatgpt'];
handler.group = true;

export default handler;
