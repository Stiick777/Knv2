import fetch from "node-fetch";

const handler = async (m, { conn, text }) => {
  try {
    if (!text || !isValidYouTubeUrl(text)) {
      return conn.reply(m.chat, '⚠️ Proporciona un *enlace válido de YouTube*.', m);
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    let title, thumbnail, url, format = "mp3";

    // ============================================================
    // 🔥 1️⃣ API PRINCIPAL — Zenzxz
    // ============================================================
    try {
      const apiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp3v2?url=${encodeURIComponent(text)}`;
      const res = await fetch(apiUrl);
      const json = await res.json();

      if (!json.success || !json.data?.download_url) throw new Error("Zenzxz falló");

      title = json.data.title;
      thumbnail = json.data.thumbnail;
      url = json.data.download_url;
      format = json.data.format || "mp3";

    } catch (e1) {
      console.log("⚠️ Zenzxz falló → probando Akirax");

      // ============================================================
      // 🔄 2️⃣ API RESPALDO — Akirax
      // ============================================================
      try {
        const backupUrl = `https://akirax-api.vercel.app/download/ytmp3?url=${encodeURIComponent(text)}`;
        const res2 = await fetch(backupUrl);
        const json2 = await res2.json();

        if (!json2.status || !json2.result?.download) throw new Error("Akirax falló");

        title = json2.result.title;
        thumbnail = json2.result.thumbnail;
        url = json2.result.download;
        format = "mp3";

      } catch (e2) {
        console.log("⚠️ Akirax falló → probando Vreden");

        // ============================================================
        // 🟣 3️⃣ ÚLTIMA OPCIÓN — Vreden
        // ============================================================
        const vredenUrl = `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(text)}&quality=128`;

        const res3 = await fetch(vredenUrl);
        const json3 = await res3.json();

        if (!json3.status || !json3.result?.download?.url) {
          throw new Error("Todas las APIs fallaron");
        }

        title = json3.result.metadata.title;
        thumbnail = json3.result.metadata.thumbnail;
        url = json3.result.download.url;
        format = "mp3";
      }
    }

    // ============================================================
    // 📦 Peso del archivo (HEAD)
    // ============================================================
    let sizeMB = 0;
    try {
      const head = await fetch(url, { method: "HEAD" });
      const length = head.headers.get("content-length");
      sizeMB = length ? Number(length) / (1024 * 1024) : 0;
    } catch { sizeMB = 0; }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    // ============================================================
    // 📸 Enviar portada
    // ============================================================
    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumbnail },
        caption: `🎶 *${title}*\n📦 ${(sizeMB || 0).toFixed(2)} MB\n🎧 ${format.toUpperCase()}`
      },
      { quoted: m }
    );

    // ============================================================
    // 🎧 Enviar audio / documento si >10MB
    // ============================================================
    const isHeavy = sizeMB > 10;

    await conn.sendMessage(
      m.chat,
      {
        [isHeavy ? "document" : "audio"]: { url },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        ...(isHeavy && { caption: `📁 Archivo enviado como documento por superar 10MB.` })
      },
      { quoted: m }
    );

  } catch (error) {
    console.error(error);
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
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
  return regex.test(url.trim());
}
