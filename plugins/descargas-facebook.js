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
  // ⭐ API ÚNICA: STARLIGHT
  // ===================================================
  try {
    const api = await fetch(
      `https://apis-starlights-team.koyeb.app/starlight/facebook?url=${encodeURIComponent(args[0])}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const json = await api.json();

    if (!json.hd && !json.sd) {
      throw new Error("Sin enlaces HD ni SD");
    }

    result = {
      title: json.title || "Facebook Video",
      thumbnail: json.thumbnail,
      duration: Math.floor((json.duration_ms || 0) / 1000),
      videoUrl: json.hd || json.sd
    };

  } catch (err) {
    console.error("❌ Error Starlight:", err.message);
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
⏱️ *Duración:* ${result.duration}s
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
