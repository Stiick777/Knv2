import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `*Ingrese el nombre de la canción 🎶*\n\n> *Ejemplo:*\n> _${usedPrefix + command} pollo_`,
            m
        );
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const query = encodeURIComponent(text);
        const url = `https://api.zenzxz.my.id/api/tools/lirik?title=${query}`;

        const res = await fetch(url);
        const json = await res.json();

        if (!json.success || !json.data?.result?.length) {
            throw new Error('No se encontraron resultados');
        }

        // 👉 Primer resultado
        const song = json.data.result[0];

        const title = song.trackName || song.name;
        const artist = song.artistName || 'Desconocido';
        const album = song.albumName || 'Desconocido';
        const lyrics = song.plainLyrics?.trim();

        if (!lyrics) {
            throw new Error('Letra no disponible');
        }

        const msg = 
`*\`【 Lʏʀɪᴄꜱ Sᴇᴀʀᴄʜ 】\`*

> *❀ Título:* _${title}_
> *❀ Artista:* _${artist}_
> *❀ Álbum:* _${album}_
> *_✯ Fuente: zenzxz.my.id_*

*ꕤ Letra:*

${lyrics}`;

        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.reply(
            m.chat,
            '*Ocurrió un error al buscar la letra 😿*',
            m
        );
    }
};

handler.command = /^letra$/i;
handler.tags = ['buscador'];
handler.help = ['letra <canción>'];
handler.group = true;

export default handler;
