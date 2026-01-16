import axios from "axios";
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `*💡 Uso Correcto:* ${usedPrefix + command} rayo`,
      m
    );
  }

  await m.react("📌");

  try {
    const url = `https://api.zenzxz.my.id/api/search/pinterest?query=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.success || !json.data || json.data.length === 0) {
      return conn.reply(
        m.chat,
        `❌ No encontré resultados para *${text}*`,
        m
      );
    }

    // Tomar hasta 6 imágenes
    const images = json.data
      .map(item => item.directLink)
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
        caption: `📍 *Resultados de Pinterest*\n🔎 *${text}*`,
        contextInfo: {
          externalAdReply: {
            title: "KanBot",
            body: "Pinterest Search • Zenzxz API",
            mediaType: 1,
            mediaUrl: images[0],
            thumbnailUrl: images[1] || images[0],
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
      } catch {
        console.log("❌ Error descargando imagen:", images[i]);
      }
    }

    await m.react("✅");

  } catch (e) {
    console.error(e);
    await m.react("❌");
    await conn.reply(
      m.chat,
      `❌ Error al buscar imágenes en Pinterest.`,
      m
    );
  }
};

handler.help = ["pinterest <texto>"];
handler.tags = ["buscador"];
handler.command = ["pinterest", "pin", "pimg"];
handler.group = true;

export default handler;
