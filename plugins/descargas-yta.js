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
    // 🔥 API DELIRIUS
    // ============================================================
    const apiUrl = `https://api.delirius.store/download/ytmp3?url=${encodeURIComponent(text)}`;

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.data?.download) {
      throw new Error("La API no devolvió el audio.");
    }

    const {
      title = "audio",
      author = "Desconocido",
      views = "0",
      likes = "0",
      image,
      download
    } = json.data;

    // ============================================================
    // 📦 Obtener tamaño del archivo
    // ============================================================
    let sizeMB = 0;
    try {
      const head = await fetch(download, { method: "HEAD" });
      const length = head.headers.get("content-length");
      sizeMB = length ? Number(length) / (1024 * 1024) : 0;
    } catch {
      sizeMB = 0;
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });

    // ============================================================
    // 📸 Portada
    // ============================================================
    if (image) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: image },
          caption:
`🎶 *${title}*

👤 Autor: ${author}
👁️ Vistas: ${Number(views).toLocaleString()}
❤️ Likes: ${Number(likes).toLocaleString()}
📦 Tamaño: ${sizeMB.toFixed(2)} MB
🎧 Formato: MP3`
        },
        { quoted: m }
      );
    }

    // ============================================================
    // 🎧 Audio o documento
    // ============================================================
    const isHeavy = sizeMB > 10;

    await conn.sendMessage(
      m.chat,
      {
        [isHeavy ? "document" : "audio"]: { url: download },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        ...(isHeavy && {
          caption: "📁 Archivo enviado como documento por superar 10 MB."
        })
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("Error YTMP3:", error);

    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    });

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
