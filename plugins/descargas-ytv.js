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

  let title, downloadUrl, thumbnail, quality;

  // ===================================================
  // ⭐ API PRINCIPAL: XYRO
  // ===================================================
  try {
    const response = await axios.post(
      "https://api.xyro.site/download/youtube",
      new URLSearchParams({ url: youtubeLink }).toString(),
      {
        headers: {
          "accept": "application/json",
          "content-type": "application/x-www-form-urlencoded"
        }
      }
    );

    const json = response.data;

    if (!json.success || !json.medias?.length) {
      throw new Error("XYRO inválido");
    }

    const media = json.medias[0]; // 👈 primer resultado

    title = json.title || "Video de YouTube";
    downloadUrl = media.url;
    thumbnail = json.thumbnail;
    quality = media.qualityLabel || media.label || "Desconocida";

  } catch (e1) {
    console.warn("Error XYRO:", e1.message);

    // ===================================================
    // ⭐ RESPALDO: VREDEN
    // ===================================================
    try {
      const api2 = await fetch(
        `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(youtubeLink)}&quality=360`
      );

      const json2 = await api2.json();

      if (!json2.status || !json2.result?.download?.url) {
        throw new Error("VREDEN inválido");
      }

      title = json2.result.metadata.title;
      downloadUrl = json2.result.download.url;
      thumbnail = json2.result.metadata.thumbnail;
      quality = json2.result.download.quality;

    } catch (e2) {
      console.error("Error VREDEN:", e2.message);
      await m.react("❌");
      return conn.sendMessage(
        m.chat,
        { text: "❌ No se pudo descargar el video. Todas las APIs fallaron." },
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

    let thumbBuffer = null;
    if (thumbnail) {
      try {
        const t = await fetch(thumbnail);
        thumbBuffer = await t.buffer();
      } catch {}
    }

    await m.react("✅");

    const isHeavy = sizeMB > 30;

    const caption = `🎬 *${title}*
📏 *Tamaño:* ${sizeMB.toFixed(2)} MB
📌 *Calidad:* ${quality}

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
        caption,
        jpegThumbnail: thumbBuffer
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
