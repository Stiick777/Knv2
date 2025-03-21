import axios from 'axios';

let handler = async (m, { conn, args }) => {
    const text = args.join(' ');
    if (!text) {
        return conn.reply(m.chat, '🍁 Ingresa lo que deseas buscar en Google.', m, rcanal);
    }

    try {
        await m.react('🤔');
        
        const response = await axios.get(`https://apidl.asepharyana.cloud/api/search/google?query=${encodeURIComponent(text)}`);
        const data = response.data;

        if (data.length > 0) {
            let responseText = `✴️ *Resultados de* : ${text}\n\n`;
            data.forEach((item) => {
                responseText += `🔰 *Título:* ${item.title}\n🔷 *Descripción:* ${item.description}\n🔗 *URL:* ${item.link}\n\n`;
            });
            
            conn.reply(m.chat, responseText, m);
            await m.react('✅');
        } else {
            conn.reply(m.chat, '🔥 No se encontraron resultados.', m, rcanal);
        }
    } catch (error) {
        await m.react('❌');
        console.error('Error al buscar en la API:', error);
        conn.reply(m.chat, '❌ Error al realizar la búsqueda. Inténtalo de nuevo más tarde.', m, rcanal);
    }
};

handler.help = ['google <búsqueda>'];
handler.tags = ['buscador'];
handler.command = ['google'];
handler.group = true;

export default handler;
