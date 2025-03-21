import { igdl } from "ruhend-scraper";

let handler = async (m, { args, conn }) => { 
  if (!args[0]) {
    return conn.reply(m.chat, '🎈 *Ingresa un link de Instagram*', m, rcanal);
  }

  // Verificación válida del enlace de Instagram
  const instagramRegex = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/.+$/;
  if (!instagramRegex.test(args[0])) {
    return conn.reply(m.chat, '💡 *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de Instagram.*', m, rcanal);
  }

  try {
    await m.react(rwait);

    let res = await igdl(args[0]);
    let data = res.data;

    for (let media of data) {
      await new Promise(resolve => setTimeout(resolve, 2000));    
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', '😎 *Tu video de Instagram by*\n' + textbot, fkontak);
      await m.react(done);
    }
  } catch {
    await m.react(error);
    conn.reply(m.chat, '❌ Ocurrió un error.', m, rcanal);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;

export default handler;
