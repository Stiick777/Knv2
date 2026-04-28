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
      `⚠️ Asegúrate de ingresar un enlace válido de YouTube.`,
      m
    );
  }

  await m.react("🕓");

  try {

    // ==============================
    // API ALYACORE
    // ==============================
    const apiUrl = "https://api.alyacore.xyz/dl/ytmp4";

    const { data } = await axios.get(apiUrl, {
      params: {
        url: youtubeLink,
        quality: "360",
        key: "Alya-7IlWb4gp"
      }
    });

    if (!data?.status || !data?.data?.dl) {
      throw new Error("Respuesta inválida de Alya API");
    }

    const title = data.data.title || "Video";
    const quality = data.data.quality || "360p";
    const size = data.data.size || "Desconocido";
    const downloadUrl = data.data.dl;

    // ==============================
    // Obtener tamaño real (opcional)
    // ==============================
    let sizeMB = 0;

    try {
      const head = await fetch(downloadUrl, {
        method: "HEAD"
      });

      const length = head.headers.get("content-length");

      if (length) {
        sizeMB = Number(length) / (1024 * 1024);
      } else {
        sizeMB = parseFloat(size) || 0;
      }

    } catch {
      sizeMB = parseFloat(size) || 0;
    }

    // ==============================
    // Descargar video
    // ==============================
    const videoRes = await axios.get(downloadUrl, {
      responseType: "arraybuffer"
    });

    const buffer = Buffer.from(videoRes.data);
    const type = await fileTypeFromBuffer(buffer);

    await m.react("✅");

    const isHeavy = sizeMB > 30;

    const caption = `🎬 *${title}*
🎞️ *Calidad:* ${quality}
📏 *Tamaño:* ${sizeMB ? sizeMB.toFixed(2)+" MB" : size}

${isHeavy
? "📁 Enviado como documento (más de 30 MB)"
: "😎 Video descargado por KanBot"
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
    console.error("Error Alya API:", err.message);
    await m.react("❌");

    await conn.sendMessage(
      m.chat,
      {
        text: "❌ No se pudo descargar el video."
      },
      { quoted: m }
    );
  }
};

handler.tags = ["descargas"];
handler.help = ["ytmp4","ytvideo","ytv"];
handler.command = ["ytmp4","ytvideo","ytv"];
handler.group = true;

export default handler;
