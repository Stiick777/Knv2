import axios from 'axios';

let handler = async (m, { conn, args }) => {
    const text = args.join(' ');
    if (!text) {
        return conn.reply(m.chat, '🍁 Ingresa lo que deseas buscar en Google.', m);
    }

    try {
        await m.react('🤔');

        // API Vreden
        const url = `https://api.vreden.my.id/api/v1/search/google?query=${encodeURIComponent(text)}&count=10`;
        const { data } = await axios.get(url);

        if (!data?.result?.search_data || data.result.search_data.length === 0) {
            return conn.reply(m.chat, '🔥 No se encontraron resultados.', m);
        }

        let result = data.result;

        let responseText = `✴️ *Resultados de:* ${text}\n`;
        responseText += `📊 *Total de resultados:* ${result.total_result_format}\n\n`;

        // Mostrar sugerencias
        if (result.sugest?.length > 0) {
            responseText += `📝 *Sugerencias:* ${result.sugest.join(', ')}\n\n`;
        }

        // Mostrar resultados
        result.search_data.forEach((item, i) => {
            responseText += `🔰 *${i + 1}. ${item.title}*\n`;
            responseText += `🔷 *Descripción:* ${item.snippet || 'Sin descripción'}\n`;
            responseText += `🔗 *URL:* ${item.link}\n\n`;
        });

        await conn.reply(m.chat, responseText, m);
        await m.react('✅');

    } catch (error) {
        await m.react('❌');
        console.error('Error al buscar en la API de Vreden:', error);
        conn.reply(m.chat, '❌ Error al realizar la búsqueda. Inténtalo más tarde.', m);
    }
};

handler.help = ['google <búsqueda>'];
handler.tags = ['buscador'];
handler.command = ['google'];

export default handler;
