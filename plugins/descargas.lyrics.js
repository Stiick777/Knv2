import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, `*Ingrese el título de una canción y el artista 🎶*

> *Ejemplo :*
> _${usedPrefix + command} heyser_`, m, rcanal);
    }

    try {
        // Reacción de carga
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // Llamar a la nueva API
        let response = await fetch(`https://api.diioffc.web.id/api/search/lirik?query=${encodeURIComponent(text)}`);
        let json = await response.json();

        if (!json.status || !json.result || !json.result.lyrics) {
            throw new Error('Letra no encontrada.');
        }

        let lyrics = json.result.lyrics;

        // Crear mensaje con la letra
        let msg = ` *\`【 Lʏʀɪᴄꜱ Sᴇᴀʀᴄʜ 】\`*\n\n`;
        msg += `> *❀ Búsqueda:* _${text}_\n`;
        msg += `> *_✯ Provided by KanBot_*\n\n`;
        msg += `> *ꕤ Letra:* \n\n${lyrics}`;

        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });

        // Reacción de éxito
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);

        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.reply(m.chat, '*Ocurrió un error al buscar la letra. Inténtalo nuevamente :(*', m,rcanal);
    }
};

handler.command = /^letra$/i;
handler.tags = ['buscador'];
handler.help = ['letra'];
handler.group = true;

export default handler;