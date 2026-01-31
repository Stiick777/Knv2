import axios from "axios";
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `*[❗INFO❗]* Ingresa un enlace de *YouTube* para descargar el video.`,
      m
    );
  }

  const youtubeLink = args[0];
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  if (!youtubeRegex.test(youtubeLink)) {
    return conn.reply(
      m.chat,
      `⚠️ Asegúrate de ingresar un enlace *válido* de YouTube.`,
      m
    );
  }

  await m.react("🕓");

  let title, downloadUrl, quality;

  // ===================================================
  // ⭐ API ÚNICA: ADONIX
  // ===================================================
  try {
    const { data } = await axios.get(
      "https://api-adonix.ultraplus.click/download/ytvideo",
      {
        params: {
          apikey: "shadow.xyz",
          url: youtubeLink
        }
      }
    );

    if (!data.status || !data.data?.url) {
      throw new Error("Respuesta inválida de Adonix");
    }

    title = data.data.title || "video";
    downloadUrl = data.data.url;
    quality = "720"; // la API no especifica calidad

  } catch (err) {
    console.error("Error Adonix:", err.message);
    await m.react("❌");
    return conn.sendMessage(
      m.chat,
      { text: "❌ No se pudo descargar el video con la API Adonix." },
      { quoted: m }
    );
  }

  // ===================================================
  // 🔍 OBTENER TAMAÑO REAL
  // ===================================================
  let sizeMB = 0;
  try {
    const head = await fetch(downloadUrl, { method: "HEAD" });
    const length = head.headers.get("content-length");
    if (length) sizeMB = Number(length) / (1024 * 1024);
  } catch {}

  // ===================================================
  // 📥 DESCARGA Y ENVÍO
  // ===================================================
  try {
    const { data } = await axios.get(downloadUrl, {
      responseType: "arraybuffer"
    });

    const buffer = Buffer.from(data);
    const type = await fileTypeFromBuffer(buffer);

    await m.react("✅");

    const isHeavy = sizeMB > 30;

    const caption = `🎬 *${title}*
🎞️ *Calidad:* ${quality}p
📏 *Tamaño:* ${sizeMB.toFixed(2)} MB

${isHeavy
      ? "📁 Enviado como *documento* (más de 30 MB)."
      : "😎 Video descargado por *KanBot*."
    }`;

    await conn.sendMessage(
      m.chat,
      {
        [isHeavy ? "document" : "video"]: buffer,
        fileName: `${title}.mp4`,
        mimetype: type?.mime || "video/mp4",
        caption
      },
      { quoted: m }
    );

  } catch (err) {
    console.error("Error envío:", err.message);
    await conn.sendMessage(
      m.chat,
      { text: "❌ Error al procesar o enviar el video." },
      { quoted: m }
    );
  }
};

handler.tags = ["descargas"];
handler.help = ["ytmp4", "ytvideo", "ytv"];
handler.command = ["ytmp4", "ytvideo", "ytv"];
handler.group = true;

export default handler;
