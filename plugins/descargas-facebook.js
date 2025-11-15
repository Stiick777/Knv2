/*const handler = async (m, { conn, args }) => {
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
    // 1️⃣ API PRINCIPAL XYRO
    // -----------------------------

    let response = await fetch(`https://api.xyro.site/download/facebook?url=${url}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    if (!response.ok) throw new Error(`XYRO HTTP ${response.status}`);

    const json = await response.json();

    if (!json.status || !json.result || json.result.length === 0) {
      throw new Error("XYRO sin resultados");
    }

    // Ordenar calidad: HD > 540p > 360p > audio
    const best = json.result.find(x => x.quality.includes("720"))
               || json.result.find(x => x.quality.includes("540"))
               || json.result.find(x => x.quality.includes("360"))
               || json.result[0];

    res = {
      title: json.result[0].fileName || "Facebook Video",
      videoUrl: best.url
    };

  } catch (e) {
    console.log("⚠️ Error en API XYRO:", e.message);

    // -----------------------------
    // 2️⃣ API RESPALDO DELIRIUS
    // -----------------------------
    try {
      await m.react('🌀');

      let response = await fetch(`https://delirius-apiofc.vercel.app/download/facebook?url=${url}`);

      if (!response.ok) throw new Error(`Delirius HTTP ${response.status}`);

      const json = await response.json();

      if (!json || (!json.urls?.length)) {
        throw new Error("Delirius sin resultados");
      }

      const hd = json.urls.find(x => x.hd)?.hd;
      const sd = json.urls.find(x => x.sd)?.sd;

      res = {
        title: json.title || "Facebook Video",
        videoUrl: hd || sd
      };

      if (!res.videoUrl) throw new Error("No se encontró enlace HD/SD");

    } catch (err2) {
      console.log("❌ Error en API Delirius:", err2.message);
      await m.react('❌');
      return conn.reply(m.chat, '❎ *No se pudo obtener el video de ninguna API.*', m);
    }
  }

  // -----------------------------
  // Enviar video
  // -----------------------------
  try {
    await m.react('📤');

    await conn.sendMessage(
      m.chat,
      {
        video: { url: res.videoUrl },
        caption: `🎥 *Facebook Video*\n📌 *Título:* ${res.title}\n✨ *_By KanBot_*`,
        fileName: 'facebook_video.mp4',
        mimetype: 'video/mp4',
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.log("Error al enviar video:", err);
    await m.react('❌');
    return conn.reply(m.chat, `❌ *Error al enviar el video use /fb2:* ${err.message}`, m);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
*/
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
    // 1️⃣ API PRINCIPAL XYRO
    // -----------------------------

    let response = await fetch(`https://api.xyro.site/download/facebook?url=${url}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    if (!response.ok) throw new Error(`XYRO HTTP ${response.status}`);

    const json = await response.json();

    if (!json.status || !json.result || json.result.length === 0) {
      throw new Error("XYRO sin resultados");
    }

    const best = json.result.find(x => x.quality.includes("720"))
               || json.result.find(x => x.quality.includes("540"))
               || json.result.find(x => x.quality.includes("360"))
               || json.result[0];

    res = {
      title: json.result[0].fileName || "Facebook Video",
      videoUrl: best.url
    };

  } catch (e) {
    console.log("⚠️ Error en API XYRO:", e.message);

    // -----------------------------
    // 2️⃣ API RESPALDO DELIRIUS
    // -----------------------------

    try {
      await m.react('🌀');

      let response = await fetch(`https://delirius-apiofc.vercel.app/download/facebook?url=${url}`);

      if (!response.ok) throw new Error(`Delirius HTTP ${response.status}`);

      const json = await response.json();

      if (!json || (!json.urls?.length)) {
        throw new Error("Delirius sin resultados");
      }

      const hd = json.urls.find(x => x.hd)?.hd;
      const sd = json.urls.find(x => x.sd)?.sd;

      res = {
        title: json.title || "Facebook Video",
        videoUrl: hd || sd
      };

      if (!res.videoUrl) throw new Error("No se encontró enlace HD/SD");

    } catch (err2) {
      console.log("❌ Error en API Delirius:", err2.message);
      await m.react('❌');
      return conn.reply(m.chat, '❎ *No se pudo obtener el video de ninguna API.*', m);
    }
  }

  // -----------------------------
  // 🚀 Enviar video sin usar disco (STREAMING)
  // -----------------------------
  try {
    await m.react('📤');

    // Descargar el video como buffer sin guardarlo en /tmp
    const { data } = await axios.get(res.videoUrl, {
      responseType: "arraybuffer"
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
    return conn.reply(m.chat, `❌ *Error al enviar el video use /fb2:* ${err.message}`, m);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
