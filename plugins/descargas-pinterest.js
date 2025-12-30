import axios from "axios";
import { fileTypeFromBuffer } from "file-type";

const handler = async (m, { conn, text, usedPrefix, command }) => {  
    if (!text) {
        return conn.reply(
            m.chat,
            `*💡 Uso Correcto:* ${usedPrefix + command} gatos`,
            m
        );
    }

    await m.react('📌');

    try {
        const url = `https://api.stellarwa.xyz/search/pinterest?query=${encodeURIComponent(text)}&key=this-xyz`;
        const res = await fetch(url);
        const json = await res.json();

        if (!json.status || !json.data || json.data.length === 0) {
            return conn.reply(
                m.chat,
                `❌ No encontré resultados para *${text}*`,
                m
            );
        }

        // Tomar hasta 6 imágenes en HD
        const images = json.data
            .map(item => item.hd)
            .filter(Boolean)
            .slice(0, 6);

        const loadImage = async (url) => {
            const { data } = await axios.get(url, { responseType: "arraybuffer" });
            const buffer = Buffer.from(data);
            const type = await fileTypeFromBuffer(buffer);
            return { buffer, mime: type?.mime || "image/jpeg" };
        };

        // -----------------------------
        // 1️⃣ Imagen principal (preview)
        // -----------------------------
        const firstImg = await loadImage(images[0]);

        await conn.sendMessage(
            m.chat,
            {
                image: firstImg.buffer,
                mimetype: firstImg.mime,
                caption: `📍 Resultados de Pinterest\n🔎 *${text}*`,
                contextInfo: {
                    externalAdReply: {
                        title: "KanBot V2",
                        body: "Búsqueda Pinterest • StellarWA",
                        mediaType: 1,
                        mediaUrl: images[1] || images[0],
                        thumbnailUrl: images[2] || images[0],
                        previewType: 0
                    }
                }
            },
            { quoted: m }
        );

        // -----------------------------
        // 2️⃣ Enviar el resto
        // -----------------------------
        for (let i = 1; i < images.length; i++) {
            try {
                const img = await loadImage(images[i]);
                await conn.sendMessage(
                    m.chat,
                    {
                        image: img.buffer,
                        mimetype: img.mime
                    },
                    { quoted: m }
                );
            } catch (err) {
                console.log("❌ Error descargando:", images[i]);
            }
        }

        await m.react('✅');

    } catch (e) {
        console.error(e);
        await m.react('❌');
        await conn.reply(
            m.chat,
            `❌ Error al buscar imágenes en Pinterest.`,
            m
        );
    }
};

handler.help = ['pinterest <texto>'];
handler.tags = ['buscador'];
handler.command = ['pinterest', 'pin', 'pimg'];
handler.group = true;

export default handler;
