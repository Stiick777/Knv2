import fetch from 'node-fetch';
import cheerio from 'cheerio';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, `*Ingrese el título de una canción y el artista 🎶*

> *Ejemplo :*
> _${usedPrefix + command} someone like you adele_`, m);
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const query = encodeURIComponent(text);
        const searchUrl = `https://www.lyrics.com/serp.php?st=${query}&qtype=2`;

        const resSearch = await fetch(searchUrl);
        const htmlSearch = await resSearch.text();
        const $ = cheerio.load(htmlSearch);

        // Buscar primer resultado de canción
        const firstResult = $('.sec-lyric.clearfix').first();
        const link = firstResult.find('a').attr('href');
        const title = firstResult.find('strong').text();
        const artist = firstResult.find('.lyric-artist').text().trim();

        if (!link) {
            throw new Error('No se encontró la canción.');
        }

        // Obtener letra de la canción
        const lyricsUrl = `https://www.lyrics.com${link}`;
        const resLyrics = await fetch(lyricsUrl);
        const htmlLyrics = await resLyrics.text();
        const $$ = cheerio.load(htmlLyrics);

        const lyrics = $$('#lyric-body-text').text().trim();

        if (!lyrics) {
            throw new Error('Letra no encontrada.');
        }

        // Construir mensaje
        const msg = ` *\`【 Lʏʀɪᴄꜱ Sᴇᴀʀᴄʜ 】\`*\n\n`
            + `> *❀ Título:* _${title}_\n`
            + `> *❀ Artista:* _${artist}_\n`
            + `> *_✯ Fuente: lyrics.com_*\n\n`
            + `> *ꕤ Letra:* \n\n${lyrics}`;

        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.reply(m.chat, '*Ocurrió un error al buscar la letra. Inténtalo nuevamente :(*', m);
    }
};

handler.command = /^letra$/i;
handler.tags = ['buscador'];
handler.help = ['letra'];
handler.group = true;

export default handler;
