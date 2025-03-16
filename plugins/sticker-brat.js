import { sticker } from '../lib/sticker.js';
import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let text;
    
    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        return conn.reply(m.chat, '💡 Te Faltó El Texto!', m);
    }
    
    if (text.length > 40) {
        return conn.reply(m.chat, '⚠️ El texto no puede tener más de 40 caracteres', m);
    }

    try {
        const response = await axios.get(`https://api.agungny.my.id/api/bratv1?q=${encodeURIComponent(text)}`);
        
        if (!response.data || !response.data.result) {
            return conn.reply(m.chat, '⚠️ No se pudo generar la imagen.', m);
        }

        const buffer = await axios.get(response.data.result, { responseType: 'arraybuffer' });
        let stiker = await sticker(buffer.data, false, global.packsticker, global.author);

        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        } else {
            return conn.reply(m.chat, '⚠️ No se pudo convertir en sticker.', m);
        }
    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, '❌ Ocurrió un error al procesar tu solicitud.', m);
    }
};

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = ['brat'];

export default handler;