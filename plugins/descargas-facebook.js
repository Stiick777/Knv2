import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook.*', m);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de Facebook.*', m);
  }

  try {
    await m.react('⏳'); // Indicar que se está procesando

    // Llamar a la API de descarga
    const response = await fetch(`https://mahiru-shiina.vercel.app/download/facebook?url=${encodeURIComponent(args[0])}`);
    const json = await response.json();

    if (!json.status || !json.data?.download) {
      await m.react('⚠️');
      return conn.reply(m.chat, '⚠️ *No se pudo obtener el video. Verifica el enlace o intenta más tarde.*', m);
    }

    const videoUrl = json.data.download;

    if (!videoUrl) {
      await m.react('🚩');
      return conn.reply(m.chat, '🚩 *No se pudo extraer un enlace de descarga válido.*', m);
    }

    await m.react('✅'); // Indicar que la descarga fue exitosa

    // Enviar el video
    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption: `🎥 *Título:* ${json.data.title}\n🌍 *Plataforma:* ${json.data.platform}\n🎈 *KanBot*`,
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
