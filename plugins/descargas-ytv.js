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

  let title = "video";
  let downloadUrl;
  let quality = "360";

  // ===================================================
  // ⭐ API PRINCIPAL: FAA
  // ===================================================
  try {
    const { data } = await axios.get(
      "https://api-faa.my.id/faa/ytmp4",
      { params: { url: youtubeLink } }
    );

    if (!data.status || !data.result?.download_url) {
      throw new Error("Respuesta inválida de FAA");
    }

    downloadUrl = data.result.download_url;
    quality = data.result.format || "mp4";
    title = "Video";

  } catch (err) {
    console.warn("❌ FAA falló, usando respaldo Nexevo...");

    // ===================================================
    // 🔁 RESPALDO: NEXEVO
    // ===================================================
    try {
      const { data } = await axios.get(
        "https://nexevo-api.vercel.app/download/y2",
        { params: { url: youtubeLink } }
      );

      if (!data.status || !data.result?.url) {
        throw new Error("Respuesta inválida de Nexevo");
      }

      downloadUrl = data.result.url;
      quality = data.result.quality || "360";
      title = data.result.info?.title || "Video";

    } catch (err2) {
      console.error("Error Nexevo:", err2.message);
      await m.react("❌");
      return conn.sendMessage(
        m.chat,
        { text: "❌ No se pudo descargar el video desde ningún servidor." },
        { quoted: m }
      );
    }
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
