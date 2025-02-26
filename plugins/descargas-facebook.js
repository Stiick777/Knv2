import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de Facebook.*', m);
  }

  try {
    await m.react('⏳'); // Reacciona indicando que está procesando

    // Llamar a la API de Facebook
    const response = await fetch(`https://api.agungny.my.id/api/facebook?url=${encodeURIComponent(args[0])}`);
    const json = await response.json();

    if (!json.status || !json.media || json.media.length === 0) {
      await m.react('⚠️');
      return conn.reply(m.chat, '⚠️ *No se encontraron enlaces de descarga. Verifica el enlace.*', m);
    }

    // Seleccionar el primer enlace disponible
    const videoUrl = json.media[0];

    if (!videoUrl) {
      await m.react('🚩');
      return conn.reply(m.chat, '🚩 *No se pudo obtener un enlace válido del video.*', m);
    }

    await m.react('✅'); // Indica éxito en la descarga

    // Enviar el video
    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption: '🎈 *Aquí está tu video de Facebook _KanBot_.*',
        fileName: 'facebook_video.mp4',
        mimetype: 'video/mp4'
      },
      { quoted: m }
    );

  } catch (error) {
    console.error('Error descargando el video de Facebook:', error);
    await m.react('❌');
    return conn.reply(m.chat, '❌ *Ocurrió un error al obtener el video. Intenta nuevamente más tarde.*', m);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;