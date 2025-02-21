import fetch from 'node-fetch';

const handler = async (m, { args, conn }) => {
  if (!args[0]) 
    return m.reply('*[❗𝐈𝐍𝐅𝐎❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙈𝘼𝙎 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀*');

  const youtubeLink = args[0];

  // Expresión regular mejorada para validar enlaces de YouTube
  const youtubeRegex = /^(https?:\/\/)?((www|m)\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?[a-zA-Z0-9_-]{11}(&\S*)?$/;
  if (!youtubeRegex.test(youtubeLink)) {
    return m.reply('*[❗𝐄𝐑𝐑𝐎𝐑❗] 𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝙋𝙍𝙊𝙋𝙊𝙍𝘾𝙄𝙊𝙉𝘼𝘿𝙊 𝙉𝙊 𝙀𝙎 𝙑𝘼́𝙇𝙄𝘿𝙊. 𝘼𝙎𝙀𝙂𝙐́𝙍𝘼𝙏𝙀 𝘿𝙀 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝙍 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀.*');
  }

  await m.react('⏳');

  try {
    await m.react('🕓'); // Indicador de proceso

    // Primera API
    const primaryApiUrl = `https://apidl.asepharyana.cloud/api/downloader/ytmp3?url=${encodeURIComponent(youtubeLink)}`;
    const primaryResponse = await fetch(primaryApiUrl, { method: 'GET' });

    if (primaryResponse.ok) {
        const primaryResult = await primaryResponse.json();

        if (primaryResult.status === "tunnel" && primaryResult.url) {
            await conn.sendMessage(m.chat, {
                audio: { url: primaryResult.url },
                mimetype: 'audio/mpeg',
                fileName: primaryResult.filename || `${primaryResult.title}.mp3`,
                ptt: false,
            }, { quoted: m });

            await m.react('✅'); // Éxito
            return;
        }
    }

    throw new Error('Fallo en la primera API');
} catch (error) {
    console.error('Error con la primera API:', error.message);

    try {
        await m.react('🕓'); // Reintento con la segunda API

        // Segunda API
        const fallbackApiUrl = `https://api.agungny.my.id/api/youtube-audio?url=${encodeURIComponent(youtubeLink)}`;
        const fallbackResponse = await fetch(fallbackApiUrl, { method: 'GET' });

        if (fallbackResponse.ok) {
            const fallbackResult = await fallbackResponse.json();

            if (fallbackResult.status && fallbackResult.result?.downloadUrl) {
                await conn.sendMessage(m.chat, {
                    audio: { url: fallbackResult.result.downloadUrl },
                    mimetype: 'audio/mpeg',
                    fileName: `${fallbackResult.result.title}.mp3`,
                    ptt: false,
                }, { quoted: m });

                await m.react('✅'); // Éxito
                return;
            }
        }

        throw new Error('Fallo en la segunda API');
    } catch (error2) {
        console.error('Error con la segunda API:', error2.message);
        await m.react('❌'); // Error final
        await conn.sendMessage(m.chat, '*[❗𝐄𝐑𝐑𝐎𝐑❗] No se pudo procesar el audio con ninguna de las APIs. Inténtalo más tarde.*', { quoted: m });
    }
}
};

handler.help = ['yta'];
handler.tags = ['descargas'];
handler.command = /^yta|audio|fgmp3|dlmp3|mp3|getaud|yt(a|mp3|mp3)$/i;
handler.group = true;

export default handler;