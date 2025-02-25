
const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m);
  }

  // Verificación válida del enlace de Facebook
  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) {
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de Facebook.*', m);
  }

  try {
    await m.react('🕛');
    let res = await fetch(`https://api.agungny.my.id/api/facebook?url=${encodeURIComponent(args[0])}`);
    let json = await res.json();

    if (!json.status || !json.media || json.media.length === 0) {
      await m.react('⚠️');
      return conn.reply(m.chat, '⚠️ *No se encontraron resultados.*', m);
    }

    let video = json.media[0]; // Toma la primera URL del array

    await conn.sendMessage(
      m.chat,
      { video: { url: video }, caption: '🎈 *Tu video de Facebook by _*Kanbot*_.*', fileName: 'fb.mp4', mimetype: 'video/mp4' },
      { quoted: m }
    );
    await m.react('✅');
  } catch (err) {
    await m.react('❌');
    return conn.reply(m.chat, '❎ *Error al obtener datos. Verifica el enlace.*', m);
  }
};

handler.help = [ 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;
