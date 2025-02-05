import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply('🚩 *Ingresa un enlace válido de TikTok.*');
  }

  // Verificación válida del enlace de TikTok
  const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com)\/.+$/;
  if (!tiktokRegex.test(text)) {
    return m.reply('🚩 *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de TikTok.*');
  }

  try {
    await m.react('🕕');
    let api = await fetch(`https://bk9.fun/download/tiktok2?url=${encodeURIComponent(text)}`);
    let json = await api.json();

    // Validar si la API devuelve un resultado válido
    if (!json.BK9 || !json.BK9.video || !json.BK9.video.noWatermark) {
      throw new Error('Respuesta inválida de la API.');
    }

    let { title, played, commented, saved, shared, song, video } = json.BK9;

    let JT = `- *Título:* ${title}
* *Reproducciones:* ${played}
* *Comentarios:* ${commented}
* *Guardado:* ${saved}
* *Compartido:* ${shared}
* *Canción:* ${song}`;

    let dl_url = video.noWatermark;
    await conn.sendFile(m.chat, dl_url, 'video.mp4', JT, m);

    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('❌');
    m.reply('🚩 *Ocurrió un error al intentar descargar el video. Por favor, verifica el enlace e intenta nuevamente.*');
  }
};

handler.help = ['tt2 <link TikTok>'];
handler.tags = ['descargas'];
handler.command = ['tt2'];
handler.group = true;

export default handler;