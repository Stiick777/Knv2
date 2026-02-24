import fetch from "node-fetch";

const handler = async (m, { conn, text }) => {
  try {
    if (!text || !isValidYouTubeUrl(text)) {
      return conn.reply(
        m.chat,
        '⚠️ Proporciona un *enlace válido de YouTube*.',
        m
      );
    }

    await conn.sendMessage(m.chat, {
      react: { text: '⏳', key: m.key }
    });

    // ============================================================
    // 🔥 API FAA (AUDIO)
    // ============================================================
    const apiUrl =
      `https://api-faa.my.id/faa/ytmp3?url=${encodeURIComponent(text)}`;

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.result?.mp3) {
      throw new Error("La API FAA falló o no devolvió audio");
    }

    const {
      title = "audio",
      thumbnail,
      duration,
      mp3
    } = json.result;

    // ============================================================
    // 📦 Tamaño del archivo (HEAD)
    // ============================================================
    let sizeMB = 0;
    try {
      const head = await fetch(mp3, { method: "HEAD" });
      const length = head.headers.get("content-length");
      sizeMB = length ? Number(length) / (1024 * 1024) : 0;
    } catch {
      sizeMB = 0;
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });

    // ============================================================
    // 📸 Enviar portada
    // ============================================================
    if (thumbnail) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: thumbnail },
          caption: `🎶 *${title}*\n⏱ ${duration}s\n📦 ${sizeMB.toFixed(2)} MB\n🎧 MP3`
        },
        { quoted: m }
      );
    }

    // ============================================================
    // 🎧 Enviar audio / documento
    // ============================================================
    const isHeavy = sizeMB > 10;

    await conn.sendMessage(
      m.chat,
      {
        [isHeavy ? "document" : "audio"]: { url: mp3 },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        ...(isHeavy && {
          caption: "📁 Archivo enviado como documento por superar 10 MB."
        })
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("Error YTMP3:", error.message);
    return m.reply(`⚠️ Error: ${error.message}`);
  }
};

handler.command = ['ytmp3', 'yta'];
handler.help = ['ytmp3 <url>'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;

// ============================================================
// 🔍 Validación de enlace YouTube
// ============================================================
function isValidYouTubeUrl(url) {
  const regex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
  return regex.test(url.trim());
}
