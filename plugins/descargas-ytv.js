import axios from "axios";
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `*[❗𝐈𝐍𝐅𝐎❗]* Ingresa un enlace de *YouTube* para descargar el video.`, m);
  }

  const youtubeLink = args[0];
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  if (!youtubeRegex.test(youtubeLink)) {
    return conn.reply(m.chat, `⚠️ Asegúrate de ingresar un enlace *válido* de YouTube.`, m);
  }

  await m.react("🕓");

  let title, downloadUrl, thumbnail, quality;

  // ===================================================
  // ⭐ 1. API PRINCIPAL: YUPRA
  // ===================================================
  try {
    const api = await fetch(
      `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeLink)}`
    );

    const json = await api.json();

    if (!json.success || !json.data?.download_url) throw new Error("Yupra inválido");

    title = json.data.title;
    downloadUrl = json.data.download_url;
    thumbnail = json.data.thumbnail;
    quality = json.data.format;

  } catch (e1) {
    console.warn("Error YUPRA:", e1.message);

    // ===================================================
    // ⭐ 2. API SECUNDARIA: AKIRAX
    // ===================================================
    try {
      const api2 = await fetch(
        `https://akirax-api.vercel.app/download/ytmp4?url=${encodeURIComponent(youtubeLink)}`
      );

      const json2 = await api2.json();

      if (!json2.status || !json2.result?.video?.url) throw new Error("Akirax inválido");

      title = json2.result.title;
      downloadUrl = json2.result.video.url;
      thumbnail = json2.result.thumbnail;
      quality = json2.result.video.quality;

    } catch (e2) {
      console.warn("Error AKIRAX:", e2.message);

      // ===================================================
      // ⭐ 3. RESPALDO FINAL: ADONIX
      // (NO DEVUELVE JSON, SOLO URL DIRECTA)
      // ===================================================
      try {
        title = "Video descargado";
        thumbnail = null;
        quality = "360p";

        downloadUrl =
          `https://api-adonix.ultraplus.click/download/ytquality?apikey=the.shadow&url=${encodeURIComponent(youtubeLink)}&type=video&quality=360p`;

      } catch (e3) {
        console.warn("Error ADONIX:", e3.message);
        await m.react("❌");
        return conn.sendMessage(
          m.chat,
          { text: "❌ No se pudo descargar el video. Todas las APIs fallaron." },
          { quoted: m }
        );
      }
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
  // 📥 DESCARGA DEL VIDEO
  // ===================================================
  try {
    const { data } = await axios.get(downloadUrl, { responseType: "arraybuffer" });

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

    const caption = `🎬 *${title}*\n📏 *Tamaño:* ${sizeMB.toFixed(2)} MB\n📌 *Calidad:* ${quality}\n\n${
      isHeavy
        ? "📁 Enviado como *documento* (pesa más de 30 MB)."
        : "😎 Su video de YouTube by *KanBot*."
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
    console.warn("Error al enviar:", err.message);
    await conn.sendMessage(m.chat, { text: "❌ Error al procesar el archivo final." }, { quoted: m });
  }
};

handler.tags = ["descargas"];
handler.help = ["ytmp4", "ytv", "ytvideo"];
handler.command = ["ytmp4", "ytvideo", "ytv"];
handler.group = true;

export default handler;
