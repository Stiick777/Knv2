const handler = async (m, { conn, args }) => { 
  if (!args[0]) { 
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m, rcanal);
  }

  // Verificación válida del enlace de Facebook
  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) { 
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de Facebook.*', m, rcanal);
  }

  let res;
  try {
    await m.react('⏳'); // Reacción de espera
    const response = await fetch(`https://api.dorratz.com/fbvideo?url=${encodeURIComponent(args[0])}`);
    res = await response.json();
  } catch (err) {
    await m.react('❌');
    return conn.reply(m.chat, '❎ *Error al obtener datos. Verifica el enlace.*', m, rcanal);
  }

  if (!res || res.length === 0) { 
    return conn.reply(m.chat, '⚠️ *No se encontraron resultados.*', m, rcanal);
  }

  // Buscar la calidad mínima 360p (SD)
  const data = res.find((i) => i.resolution === '720p (HD)');

  if (!data) { 
    return conn.reply(m.chat, '🚩 *No se encontró una resolución adecuada.*', m, rcanal);
  }

  let video = data.url;
  try {
    await m.react('📤'); // Reacción de envío
    await conn.sendMessage(m.chat, { 
      video: { url: video }, 
      caption: '🎈 *Tu video de Facebook by KanBot.*', 
      fileName: 'facebook_video.mp4', 
      mimetype: 'video/mp4' 
    }, { quoted: m });
    await m.react('✅'); // Reacción de éxito
  } catch (err) {
    await m.react('❌');
    return conn.reply(m.chat, '❌ *Error al enviar el video.*', m, rcanal);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
