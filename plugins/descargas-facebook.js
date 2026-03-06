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
  // ⭐ API: DELIRIUS FACEBOOK
  // ===================================================
  try {

    const api = `https://api.delirius.store/download/facebook?url=${encodeURIComponent(args[0])}`;

    const response = await fetch(api);
    const json = await response.json();

    if (!json.urls || !json.urls.length) {
      throw new Error("No se encontraron enlaces");
    }

    const video = json.urls[0];

    const videoUrl = video.hd || video.sd;

    result = {
      title: json.title || "Facebook Video",
      videoUrl
    };

  } catch (err) {
    console.error("❌ Error API:", err.message);
    await m.react("❌");
    return conn.reply(
      m.chat,
      "❎ *No se pudo obtener el video de Facebook.*",
      m
    );
  }

  // ===================================================
  // 📥 DESCARGA Y ENVÍO
  // ===================================================
  try {

    await m.react("📥");

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
        fileName: "facebook.mp4",
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
