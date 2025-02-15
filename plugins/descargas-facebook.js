import { igdl } from 'ruhend-scraper';

const handler = async (m, { text, conn, args, usedPrefix, command }) => {
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
  
    await m.react(rwait);
    res = await igdl(args[0]);
  } catch {
    await m.react(error);
    return conn.reply(m.chat, '🚩 *Error al obtener datos. Verifica el enlace.*', m, fake);
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, '🚩 *No se encontraron resultados.*', m, fake);
  }

  let data;
  try {
    await m.react(rwait);
    data = result.find((i) => i.resolution === '720p (HD)') || result.find((i) => i.resolution === '360p (SD)');
  } catch {
    await m.react(error);
    return conn.reply(m.chat, '🚩 *Error al procesar los datos.*', m, rcanal);
  }

  if (!data) {
    return conn.reply(m.chat, '🚩 *No se encontró una resolución adecuada.*', m, rcanal);
  }

  let video = data.url;
  try {
    await m.react(rwait);
    await conn.sendMessage(
      m.chat,
      { video: { url: video }, caption: '🎈 *Tu video de Facebook.*\n' + textbot, fileName: 'fb.mp4', mimetype: 'video/mp4' },
      { quoted: fkontak }
    );
    await m.react(done);
  } catch {
    await m.react(error);
    return conn.reply(m.chat, '❌ *Error al enviar el video.*', m, rcanal);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
