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
    let title;
    let quality;
    let downloadUrl;
    let servidor;

    // ==============================
    // API PRINCIPAL: DELIRIUS
    // ==============================
    try {
      const { data } = await axios.get(
        `https://api.delirius.store/download/ytmp4?url=${encodeURIComponent(youtubeLink)}&format=360p`
      );

      if (!data?.status || !data?.data?.download) {
        throw new Error("Respuesta inválida de Delirius");
      }

      title = data.data.title || "Video";
      quality = data.data.format || "360p";
      downloadUrl = data.data.download;
      servidor = "Delirius";

    } catch (e) {
      console.log("Delirius falló, usando ZennzXD...");

      // ==============================
      // API RESPALDO: ZENNZXD
      // ==============================
      const { data } = await axios.get(
        `https://api.zenzxz.my.id/download/youtube?url=${encodeURIComponent(youtubeLink)}&format=360`
      );

      if (!data?.status || !data?.result?.download) {
        throw new Error("Respuesta inválida de ZennzXD");
      }

      title = data.result.title || "Video";
      quality = `${data.result.format}p`;
      downloadUrl = data.result.download;
      servidor = "ZennzXD";
    }

    // ==============================
    // Obtener tamaño real
    // ==============================
    let sizeMB = 0;

    try {
      const head = await fetch(downloadUrl, {
        method: "HEAD"
      });

      const length = head.headers.get("content-length");

      if (length) {
        sizeMB = Number(length) / (1024 * 1024);
      }
    } catch {
      sizeMB = 0;
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
📏 *Tamaño:* ${sizeMB ? sizeMB.toFixed(2) + " MB" : "Desconocido"}
🌐 *Servidor:* ${servidor}

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
    console.error("Error descarga:", err);

    await m.react("❌");

    await conn.sendMessage(
      m.chat,
      {
        text: "❌ No se pudo descargar el video desde ningún servidor."
      },
      { quoted: m }
    );
  }
};

handler.tags = ["descargas"];
handler.help = ["ytmp4", "ytvideo", "ytv"];
handler.command = ["ytmp4", "ytvideo", "ytv"];
handler.group = true;

export default handler;
