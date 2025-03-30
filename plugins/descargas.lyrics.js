import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, `*Ingrese el título de una canción y el artista 🎶*

> *Ejemplo :*
> _${usedPrefix + command} mia - nanpa básico_`, m, rcanal);
    }

    try {
        // Enviar reacción de carga
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // Llamar a la API
        let response = await fetch(`https://api.agungny.my.id/api/lirik?q=${encodeURIComponent(text)}`);
        let ApiData = await response.json();

        // Verificar si la respuesta es válida
        if (!ApiData.status) {
            throw new Error('No se encontró la letra de la canción.');
        }

        let { title, artist, released, lyrics } = ApiData.result;

        // Crear el mensaje con la letra
        let txt = ' *\`【 Lʏʀɪᴄꜱ Sᴇᴀʀᴄʜ 】\`*\n\n';
        txt += `> *❀ Canción:* _${title}_\n`;
        txt += `> *௹ Artista:* _${artist}_\n`;
        txt += `> *❥ Lanzamiento:* _${released}_\n`;
        txt += `> *_✯ Provided by KanBot_*\n\n`;
        txt += `> *ꕤ Letra:* \n\n${lyrics}\n`.trim();

        // Enviar mensaje con la letra
        await conn.sendMessage(m.chat, { text: txt }, { quoted: m });

        // Enviar reacción de éxito
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);

        // Enviar reacción de error
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        // Responder con un mensaje de error
        await conn.reply(m.chat, '*Ocurrió un error al buscar la letra. Inténtalo nuevamente :(*', m, rcanal);
    }
};

handler.command = /^letra$/i;
handler.tags = ['buscador'];
handler.help = ['letra'];
handler.group = true;

export default handler;
