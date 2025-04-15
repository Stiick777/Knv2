const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*💡 Uso Correcto: ${usedPrefix + command} <búsqueda>*`, m);

    await m.react('🔍');

    try {
        const res = await fetch(`https://api.ssateam.my.id/api/pinterest?q=${encodeURIComponent(text)}&apikey=makangratis`);
        const json = await res.json();

        if (!json.status || !json.data || !json.data.length) {
            return conn.reply(m.chat, `❌ No encontré resultados para *${text}*`, m);
        }

        const images = json.data.slice(0, 6).map(item => item.image);

        await conn.sendMessage(m.chat, {
            image: { url: images[0] },
            caption: `📍 Resultado de: *${text}*`,
            contextInfo: {
                externalAdReply: {
                    mediaUrl: json.data[0].pin_url,
                    mediaType: 1,
                    thumbnailUrl: images[1] || images[0],
                    title: json.data[0].title || 'Pinterest Image',
                    body: `Subido por: ${json.data[0].uploader.full_name || 'Desconocido'}`,
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