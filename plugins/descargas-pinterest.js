const handler = async (m, { conn, text, usedPrefix, command }) => {  
    if (!text) return conn.reply(m.chat, `*💡 Uso Correcto: ${usedPrefix + command} gatos*`, m);  

    await m.react('📌');  

    try {  
        const res = await fetch(`https://api.xyro.site/search/pinterest?q=${encodeURIComponent(text)}`);  
        const json = await res.json();  

        if (!json.status || !json.result || !json.result.length) {
            return conn.reply(m.chat, `❌ No encontré resultados para *${text}*`, m);
        }

        // Tomamos hasta 6 imágenes  
        const images = json.result.slice(0, 6).map(item => item.url);

        // Enviar la primera imagen con preview
        await conn.sendMessage(m.chat, { 
            image: { url: images[0] }, 
            caption: `📍 Resultado de: *${text}*`, 
            contextInfo: { 
                externalAdReply: { 
                    mediaUrl: images[1] || images[0], 
                    mediaType: 1, 
                    thumbnailUrl: images[2] || images[0], 
                    title: "KanBot V2", 
                    body: "Aquí están tus imágenes", 
                    previewType: 0 
                } 
            } 
        });

        // Enviar el resto
        for (let i = 1; i < images.length; i++) {
            await conn.sendFile(m.chat, images[i], 'image.jpg', '', m);
        }

        await m.react('✅');

    } catch (e) {  
        console.error(e);  
        await conn.reply(m.chat, `❌ Error al buscar imágenes. Inténtalo con /pin2`, m);  
    }  
};  

handler.help = ['pinterest <query>'];  
handler.tags = ['buscador'];  
handler.command = ['pinterest', 'pin', 'pimg'];  
handler.group = true;  

export default handler;
