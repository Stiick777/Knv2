const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*💡 Uso Correcto: ${usedPrefix + command} <búsqueda>*`, m);

    await m.react('🔍');

    try {
        const res = await fetch(`https://delirius-apiofc.vercel.app/search/pinterest?text=${encodeURIComponent(text)}`);
        const json = await res.json();

        if (!json.status || !json.results || !json.results.length) {
            return conn.reply(m.chat, `❌ No encontré resultados para *${text}*`, m);
        }

        const images = json.results.slice(0, 6);

        await conn.sendMessage(m.chat, {
            image: { url: images[0] },
            caption: `📍 Resultado de: *${text}*`,
            contextInfo: {
                externalAdReply: {
                    mediaUrl: images[0],
                    mediaType: 1,
                    thumbnailUrl: images[1] || images[0],
                    title: 'Imagen de Pinterest',
                    body: 'Fuente: delirius-apiofc.vercel.app',
                    previewType: 0
                }
            }
        });

        await Promise.all(images.slice(1).map(url => conn.sendFile(m.chat, url, 'image.jpg', '', m)));

        await m.react('✅');

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `❌ Error al buscar imágenes. Intenta más tarde.\n\n*Error:* ${e.message}`, m);
    }
};

handler.help = ['pinterest2 <búsqueda>'];
handler.tags = ['buscador'];
handler.command = ['pinterest2', 'pin2', 'pimg2'];
handler.group = true;

export default handler;
