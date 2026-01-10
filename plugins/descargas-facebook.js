import axios from "axios";
import { fileTypeFromBuffer } from "file-type";

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido.*', m);
  }

  const url = encodeURIComponent(args[0]);
  let res;

  try {
    await m.react('⏳');

    // -----------------------------
    // 1️⃣ API ADONIX (PRINCIPAL)
    // -----------------------------
    const response = await fetch(
      `https://api-adonix.ultraplus.click/download/facebook?apikey=shadow.xyz&url=${url}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Adonix HTTP ${response.status}`);
    }

    const json = await response.json();

    if (!json.status || !json.result?.media) {
      throw new Error("Adonix sin resultados");
    }

    const media = json.result.media;

    res = {
      title: json.result.info?.title || "Facebook Video",
      videoUrl: media.video_hd || media.video_sd
    };

    if (!res.videoUrl) {
      throw new Error("No se encontró video HD ni SD");
    }

  } catch (err) {
    console.log("❌ Error en API Adonix:", err.message);
    await m.react('❌');
    return conn.reply(m.chat, '❎ *No se pudo obtener el video desde Facebook.*', m);
  }

  // -----------------------------
  // 🚀 Enviar video (STREAMING)
  // -----------------------------
  try {
    await m.react('📤');

    const { data } = await axios.get(res.videoUrl, {
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
        caption: `🎥 *Facebook Video*\n📌 *Título:* ${res.title}\n✨ *_By KanBot_*`
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.log("Error al enviar video:", err);
    await m.react('❌');
    return conn.reply(
      m.chat,
      `❌ *Error al enviar el video. Intenta nuevamente.*`,
      m
    );
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
