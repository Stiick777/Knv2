import fetch from "node-fetch";

const handler = async (m, { conn, text }) => {
  try {
    if (!text || !isValidYouTubeUrl(text)) {
      return conn.reply(m.chat, '⚠️ Proporciona un *enlace válido de YouTube*.', m);
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    let title, thumbnail, url, filesize, quality, format;

    try {
      // 🔥 API PRINCIPAL: XYRO
      const xyroUrl = `https://api.xyro.site/download/youtubemp3?url=${encodeURIComponent(text)}`;
      const res0 = await fetch(xyroUrl);
      const data0 = await res0.json();

      if (!data0.status || !data0.result?.download) throw new Error("XYRO falló");

      title = data0.result.title;
      thumbnail = data0.result.thumbnail;
      url = data0.result.download;
      filesize = "Desconocido";
      quality = data0.result.quality || "128kbps";
      format = data0.result.format || "mp3";

    } catch (err0) {
      console.log("⚠️ XYRO falló, usando Yupra…");
      try {
        // BACKUP 1 — Yupra
        const yupraUrl = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(text)}`;
        const res2 = await fetch(yupraUrl);
        const data2 = await res2.json();

        if (data2.status !== 200 || !data2.result?.link) throw new Error("Yupra falló");

        title = data2.result.title;
        thumbnail = `https://i.ytimg.com/vi/${extractVideoId(text)}/0.jpg`;
        url = data2.result.link;
        filesize = `${(data2.result.filesize / 1024 / 1024).toFixed(2)} MB`;
        quality = "128kbps";
        format = "mp3";

      } catch (err2) {
        console.log("⚠️ Yupra falló, usando Zenzxz…");
        try {
          // BACKUP 2 — Zenzxz
          const zenzUrl = `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(text)}`;
          const res3 = await fetch(zenzUrl);
          const data3 = await res3.json();

          if (!data3.status || !data3.download_url) throw new Error("Zenzxz falló");

          title = data3.title;
          thumbnail = data3.thumbnail;
          url = data3.download_url;
          filesize = "Desconocido";
          quality = "128kbps";
          format = "mp3";

        } catch (err3) {
          console.log("⚠️ Zenzxz falló, usando Sylphy…");
          try {
            // BACKUP 3 — Sylphy
            const sylphyKey = "sylphy-25c2";
            const sylphyUrl = `https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(text)}&apikey=${sylphyKey}`;
            const res4 = await fetch(sylphyUrl);
            const data4 = await res4.json();

            if (!data4.status || !data4.res?.url) throw new Error("Sylphy falló");

            ({ title, thumbnail, url, filesize, quality, format } = data4.res);

          } catch (err4) {
            console.log("⚠️ Sylphy falló, usando Stellar…");

            // BACKUP 4 — Stellar
            const stellarKey = "stellar-53mIXDr2";
            const stellarUrl = `https://api.stellarwa.xyz/dow/ytmp3?url=${encodeURIComponent(text)}&apikey=${stellarKey}`;
            const res5 = await fetch(stellarUrl);
            const data5 = await res5.json();

            if (!data5.status || !data5.data?.dl) throw new Error("Stellar también falló");

            title = data5.data.title;
            thumbnail = `https://i.ytimg.com/vi/${extractVideoId(text)}/0.jpg`;
            url = data5.data.dl;
            filesize = "Desconocido";
            quality = "128kbps";
            format = "mp3";
          }
        }
      }
    }

    // Calcular tamaño si viene desconocido
    let sizeMB = 0;
    if (filesize === "Desconocido") {
      try {
        const head = await fetch(url, { method: "HEAD" });
        const length = head.headers.get("content-length");
        if (length) sizeMB = Number(length) / (1024 * 1024);
      } catch {
        sizeMB = 0;
      }
    } else {
      sizeMB = parseFloat(filesize);
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumbnail },
        caption: `🎶 *${title}*\n📦 ${(sizeMB || 0).toFixed(2)} MB\n🎧 ${quality} ${format}`
      },
      { quoted: m }
    );

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

function isValidYouTubeUrl(url) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
  return regex.test(url.trim());
}

function extractVideoId(url) {
  const match = url.match(/(v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[2] : null;
}
