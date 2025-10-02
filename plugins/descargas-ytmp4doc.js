import fetch from 'node-fetch';

let handler = async (m, { conn: star, args }) => {
  if (!args || !args[0]) 
    return star.reply(m.chat, '💣 _*Ingresa el enlace del video de YouTube junto al comando.*_\n\n`Ejemplo:`\n> *!ytmp4doc* https://youtube.com/watch?v=qHDJSRlNhVs', m, rcanal);

  if (!args[0].match(/youtu/gi)) 
    return star.reply(m.chat, `Verifica que el enlace sea de YouTube.`, m, rcanal).then(() => m.react('✖️'));

  await m.react('🕓'); // Reacción mientras procesa

  try {
    let v = args[0];
    let title, download_url, thumbnail;

    // === API 1: Ruby-Core ===
    try {
      let res1 = await fetch(`https://ruby-core.vercel.app/api/download/youtube/mp4?url=${encodeURIComponent(v)}`);
      let data1 = await res1.json();

      if (!data1.status || !data1.download?.url) throw new Error("Ruby-Core no válido");

      title = data1.metadata.title;
      download_url = data1.download.url;
      thumbnail = data1.metadata.thumbnail;
    } catch (err1) {
      console.warn("Error Ruby-Core:", err1.message);

      // === API 2: Starlight ===
      try {
        let res2 = await fetch(`https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(v)}`);
        let data2 = await res2.json();

        if (!data2.url || !data2.title) throw new Error("Starlight no válido");

        title = data2.title;
        download_url = data2.url;
        thumbnail = data2.thumbnail;
      } catch (err2) {
        console.warn("Error Starlight:", err2.message);

        // === API 3: Yupra ===
        try {
          let res3 = await fetch(`https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(v)}`);
          let data3 = await res3.json();

          if (!data3.status || !data3.result?.formats?.length) throw new Error("Yupra no válido");

          let video = data3.result.formats.find(f => f.itag === 18) || data3.result.formats[0];
          title = data3.result.title;
          download_url = video.url;
          thumbnail = data3.result.thumbnail;
        } catch (err3) {
          console.warn("Error Yupra:", err3.message);

          // === API 4: Shylpy ===
          try {
            let res4 = await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(v)}&apikey=sylphy-25c2`);
            let data4 = await res4.json();

            if (!data4.status || !data4.res?.url) throw new Error("Shylpy no válido");

            title = data4.res.title;
            download_url = data4.res.url;
            thumbnail = null;
          } catch (err4) {
            console.warn("Error Shylpy:", err4.message);

            // === API 5: Stellar ===
            try {
              let res5 = await fetch(`https://api.stellarwa.xyz/dow/ytmp4v2?url=${encodeURIComponent(v)}&apikey=stellar-53mIXDr2`);
              let data5 = await res5.json();

              if (!data5.status || !data5.data?.dl) throw new Error("Stellar no válido");

              title = data5.data.title;
              download_url = data5.data.dl;
              thumbnail = data5.data.thumbnail;
            } catch (err5) {
              console.warn("Error Stellar:", err5.message);

              // ❌ Si todas las APIs fallan
              await star.sendMessage(m.chat, { text: "❌ No se pudo obtener el video. Todas las APIs fallaron." }, { quoted: m });
              return await m.react('✖️');
            }
          }
        }
      }
    }

    // === Mensaje de espera ===
    let txt = '`🅓🅞🅒🅢 🅥➋ - 🅚🅐🅝🅑🅞🅣`\n\n';
    txt += `	🍁   *Título*: ${title}\n\n`;
    txt += `> ️ *Se está enviando su video, por favor espere*`;

    await star.reply(m.chat, txt, m);

    // === Enviar el video como documento ===
    await star.sendMessage(m.chat, {
      document: { url: download_url },
      caption: `🌝 *Provided by KanBot* 🌚`,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      jpegThumbnail: thumbnail ? await (await fetch(thumbnail)).buffer() : null
    }, { quoted: m });

    return await m.react('✅'); // Reacción de éxito

  } catch (error) {
    console.error("Error general:", error.message);
    await m.react('✖️');
    await star.reply(m.chat, '❌ _*Error al procesar el enlace. Por favor, intenta de nuevo.*_', m, rcanal);
  }
};

handler.help = ['ytmp4doc *<link yt>*'];
handler.tags = ['descargas'];
handler.command = ['ytmp4doc', 'yt4doc'];
handler.group = true;

export default handler;
