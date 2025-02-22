import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
    if (!text) {
        await conn.sendMessage(m.chat, { text: '*🧧 Ingrese una petición para generar una imagen con AI...*' }, { quoted: m });
        return;
    }

    m.react('🕒');
    await conn.sendMessage(m.chat, { text: '*🧧 Generando imagen, por favor espere...*' }, { quoted: m });

    try {
        const response = await fetch(`https://bk9.fun/ai/magicstudio?prompt=${encodeURIComponent(text)}`);
        
        if (!response.ok) {
            await conn.sendMessage(m.chat, { text: '*❌ Error al generar la imagen. Inténtelo de nuevo más tarde.*' }, { quoted: m });
            return;
        }

        const buffer = await response.buffer();
        m.react('✅');
        await conn.sendMessage(m.chat, { image: buffer }, { quoted: m });

    } catch (error) {
        await conn.sendMessage(m.chat, { text: '*❌ Ocurrió un error al procesar la solicitud.*' }, { quoted: m });
    }
};

handler.tags = ['ai'];
handler.help = ['dalle'];
handler.command = ['dalle'];
handler.group = true;

export default handler;