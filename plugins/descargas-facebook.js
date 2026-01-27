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
  // ⭐ API: ADONIX FACEBOOK
  // ===================================================
  try {
    const apiUrl = `https://api-adonix.ultraplus.click/download/facebook?apikey=shadow.xyz&url=${encodeURIComponent(args[0])}`;

    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const json = await res.json();

    if (!json.status || !json.result?.hd && !json.result?.sd) {
      throw new Error("No se encontraron enlaces de video");
    }

    result = {
      title: json.result.title || "Facebook Video",
      thumbnail: json.result.thumbnail,
      duration: json.result.duration || "Desconocida",
      videoUrl: json.result.hd || json.result.sd
    };

  } catch (err) {
    console.error("❌ Error Adonix:", err.message);
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
⏱️ *Duración:* ${result.duration}
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
