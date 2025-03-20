import axios from 'axios';
import * as cheerio from 'cheerio';

let handler = async (m, { text }) => {
    if (!text) {
        m.reply('✳️ Debes ingresar un término de búsqueda para Wikipedia.');
        return;
    }

    try {
        const link = await axios.get(`https://es.wikipedia.org/wiki/${encodeURIComponent(text)}`);
        const $ = cheerio.load(link.data);
        let resulw = $('#mw-content-text > div.mw-parser-output').find('p').first().text().trim();

        if (!resulw) {
            m.reply('⚠️ No se encontró información relevante en Wikipedia.');
        } else {
            m.reply(`▢ *Wikipedia*\n\n‣ ${resulw}`);
        }
    } catch (e) {
        m.reply('⚠️ Ocurrió un error al buscar en Wikipedia.');
    }
};

handler.help = ['wikipedia'];
handler.tags = ['buscador'];
handler.command = ['wiki', 'wikipedia'];
handler.group = true
export default handler;