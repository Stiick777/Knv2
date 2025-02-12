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
    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(youtubeLink)}`;
    const response = await fetch(apiUrl, { method: 'GET' });

    if (response.ok) {
        const result = await response.json();

        // Validar respuesta y enlace de descarga
        if (result.status === 200 && result.result?.download_url) {
            const downloadUrl = result.result.download_url;
            const title = result.result.title;

            // Enviar el archivo como audio en formato .mp3
            await conn.sendMessage(m.chat, {
                audio: { url: downloadUrl },
                mimetype: 'audio/mpeg', // Especificar el formato .mp3
                fileName: `${title}.mp3`,
                ptt: false // Cambia a true si deseas que se envíe como nota de voz
            }, { quoted: m });

            await m.react('✅');
            return;
        } else {
            return m.reply('*[❗𝐄𝐑𝐑𝐎𝐑❗] 𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙊́ 𝙀𝙇 𝘼𝙐𝘿𝙄𝙊. 𝙋𝙍𝙐𝙀𝘽𝘼 𝙊𝙏𝙍𝘼 𝙑𝙀𝙕.*');
        }
    } else {
        return m.reply(`*[❗𝐄𝐑𝐑𝐎𝐑❗] 𝙁𝘼𝙇𝙇𝙊́ 𝙇𝘼 𝘾𝙊𝙈𝙐𝙉𝙄𝘾𝘼𝘾𝙄𝙊́𝙉 𝘾𝙊𝙉 𝙇𝘼 𝘼𝙋𝙄: ${response.statusText}*`);
    }
} catch (error) {
    console.error('Error al obtener audio:', error);
    return m.reply('*[❗𝐄𝐑𝐑𝐎𝐑❗] 𝙉𝙊 𝙎𝙀 𝙋𝙐𝙀𝘿𝙀 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝘼𝙐𝘿𝙄𝙊. 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍 𝙈𝘼𝙎 𝙏𝘼𝙍𝘿𝙀.*');
}
};

handler.help = ['yta'];
handler.tags = ['descargas'];
handler.command = /^yta|audio|fgmp3|dlmp3|mp3|getaud|yt(a|mp3|mp3)$/i;
handler.group = true;

export default handler;