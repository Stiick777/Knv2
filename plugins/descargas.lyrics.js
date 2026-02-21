import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `*Ingrese el nombre de la canción 🎶*\n\n> *Ejemplo:*\n> _${usedPrefix + command} Hola remix_`,
            m
        );
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://api.delirius.store/search/lyrics?query=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (!json.status || !json.data) {
            throw new Error('No se encontraron resultados');
        }

        const song = json.data;

        const title = song.title || 'Desconocido';
        const artists = song.artists || 'Desconocido';
        const album = song.album || 'Desconocido';
        const duration = song.duration || '-';
        const lyrics = song.lyrics?.trim();

        if (!lyrics) {
            throw new Error('Letra no disponible');
        }

        const msg = 
`*\`【 LYRICS SEARCH 】\`*

🎵 *Título:* ${title}
👤 *Artista(s):* ${artists}
💽 *Álbum:* ${album}
⏱ *Duración:* ${duration}

📜 *Letra:*

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
