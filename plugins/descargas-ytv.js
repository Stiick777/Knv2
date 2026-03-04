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

  try {
    // ===================================================
    // ⭐ ÚNICA API: STARLIGHT
    // ===================================================
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp4`;

    const { data } = await axios.get(apiUrl, {
      params: {
        url: youtubeLink,
        format: "360p"
      }
    });

    if (!data?.dl_url) {
      throw new Error("Respuesta inválida de la API");
    }

    const title = data.title || "Video";
    const quality = data.quality || "360p";
    const downloadUrl = data.dl_url;

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
    // 📥 DESCARGAR VIDEO
    // ===================================================
    const videoRes = await axios.get(downloadUrl, {
      responseType: "arraybuffer"
    });

    const buffer = Buffer.from(videoRes.data);
    const type = await fileTypeFromBuffer(buffer);

    await m.react("✅");

    const isHeavy = sizeMB > 30;

    const caption = `🎬 *${title}*
🎞️ *Calidad:* ${quality}
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
    console.error("Error Starlight API:", err.message);
    await m.react("❌");
    await conn.sendMessage(
      m.chat,
      { text: "❌ No se pudo descargar el video. Intenta nuevamente." },
      { quoted: m }
    );
  }
};

handler.tags = ["descargas"];
handler.help = ["ytmp4", "ytvideo", "ytv"];
handler.command = ["ytmp4", "ytvideo", "ytv"];
handler.group = true;

export default handler;
