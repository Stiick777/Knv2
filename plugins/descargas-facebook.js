import axios from "axios";
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, "🎈 *Ingresa un link de Facebook*", m);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(m.chat, "❌ *El enlace proporcionado no es válido.*", m);
  }

  await m.react("⏳");

  let result;

  // ===================================================
  // ⭐ API: ANABOT FACEBOOK
  // ===================================================
  try {
    const apiUrl = `https://anabot.my.id/api/download/facebook?url=${encodeURIComponent(args[0])}&apikey=freeApikey`;

    const response = await fetch(apiUrl);
    const json = await response.json();

    if (!json.success || !json.data?.result?.api?.mediaItems) {
      throw new Error("No se encontraron medios");
    }

    const mediaItems = json.data.result.api.mediaItems;

    // Filtrar solo videos
    const videos = mediaItems.filter(item => item.type === "Video");

    if (!videos.length) {
      throw new Error("No hay videos disponibles");
    }

    // Prioridad de calidad
    const qualityOrder = ["1080p", "720p", "540p", "360p"];

    let selectedVideo;
    for (let quality of qualityOrder) {
      selectedVideo = videos.find(v => v.mediaRes === quality);
      if (selectedVideo) break;
    }

    // Si no encuentra por resolución, toma el primero
    if (!selectedVideo) selectedVideo = videos[0];

    result = {
      title: json.data.result.api.title || "Facebook Video",
      videoUrl: selectedVideo.mediaUrl
    };

  } catch (err) {
    console.error("❌ Error Anabot:", err.message);
    await m.react("❌");
    return conn.reply(
      m.chat,
      "❎ *No se pudo obtener el video desde Facebook.*",
      m
    );
  }

  // ===================================================
  // 📥 DESCARGA Y ENVÍO
  // ===================================================
  try {
    await m.react("📤");

    const { data } = await axios.get(result.videoUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const buffer = Buffer.from(data);
    const type = await fileTypeFromBuffer(buffer);

    await conn.sendMessage(
      m.chat,
      {
        video: buffer,
        mimetype: type?.mime || "video/mp4",
        fileName: "facebook_video.mp4",
        caption: `🎥 *Facebook Video*
📌 *Título:* ${result.title}
✨ *_By KanBot_*`
      },
      { quoted: m }
    );

    await m.react("✅");

  } catch (err) {
    console.error("❌ Error al enviar:", err.message);
    await m.react("❌");
    return conn.reply(
      m.chat,
      "❌ *Error al enviar el video. Intenta nuevamente.*",
      m
    );
  }
};

handler.help = ["facebook <url>", "fb <url>"];
handler.tags = ["descargas"];
handler.command = ["facebook", "fb"];
handler.group = true;

export default handler;
