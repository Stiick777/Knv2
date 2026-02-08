import axios from "axios";
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";

const MAX_IMAGES = 6;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `*💡 Uso Correcto:* ${usedPrefix + command} gato`,
      m
    );
  }

  await m.react("📌");

  try {
    // 🔥 API Faa Pinterest
    const apiUrl = `https://api-faa.my.id/faa/pinterest?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.result || json.result.length === 0) {
      return conn.reply(
        m.chat,
        `❌ No encontré resultados para *${text}*`,
        m
      );
    }

    const images = json.result.slice(0, MAX_IMAGES);

    const loadImage = async (url) => {
      const { data } = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(data);
      const type = await fileTypeFromBuffer(buffer);
      return {
        buffer,
        mime: type?.mime || "image/jpeg"
      };
    };

    // -----------------------------
    // 1️⃣ Imagen principal
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
            body: "Pinterest Search • Faa API",
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
    // 2️⃣ Resto de imágenes
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
