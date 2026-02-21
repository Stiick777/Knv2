const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*💡 Uso Correcto: ${usedPrefix + command} <búsqueda>*`, m);

    await m.react('🔍');

    try {
        const res = await fetch(`https://api.delirius.store/search/pinterest?text=${encodeURIComponent(text)}`);
        const json = await res.json();

        if (!json.status || !json.results || !json.results.length) {
            return conn.reply(m.chat, `❌ No encontré resultados para *${text}*`, m);
        }

        const images = json.results.slice(0, 6);

        // Enviar primera imagen con preview
        await conn.sendMessage(m.chat, {
            image: { url: images[0] },
            caption: `📌 Resultado de Pinterest\n🔎 Búsqueda: *${text}*`,
            contextInfo: {
                externalAdReply: {
                    title: 'Imagen de Pinterest',
                    body: 'Fuente: api.delirius.store',
                    mediaType: 1,
                    mediaUrl: images[0],
                    thumbnailUrl: images[0],
                    previewType: 0,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        // Enviar las demás imágenes
        for (let url of images.slice(1)) {
            await conn.sendFile(m.chat, url, 'pinterest.jpg', '', m);
        }

        await m.react('✅');

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `❌ Error al buscar imágenes.\n\n*Error:* ${e.message}`, m);
    }
};

handler.help = ['pinterest2 <búsqueda>'];
handler.tags = ['buscador'];
handler.command = ['pinterest2', 'pin2', 'pimg2'];
handler.group = true;

export default handler;
