const handler = async (m, { conn, args }) => { 
  if (!args[0]) { 
    return conn.reply(m.chat, '🎈 *Ingresa un link de Facebook*', m);
  }

  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
  if (!facebookRegex.test(args[0])) { 
    return conn.reply(m.chat, '❌ *El enlace proporcionado no es válido. Asegúrate de ingresar un enlace correcto de Facebook.*', m);
  }

  try {
    await m.react('⏳'); // Reacción de espera

    const response = await fetch('https://api.siputzx.my.id/api/d/facebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({ url: args[0] })
    });

    const res = await response.json();

    if (!res || !res.status || !res.data || res.data.length === 0) {
      await m.react('⚠️');
      return conn.reply(m.chat, '⚠️ *No se encontraron resultados para este enlace.*', m);
    }

    // Buscar el primer resultado (normalmente ya es el de mejor calidad)
    const data = res.data[0];

    if (!data.url) {
      await m.react('🚩');
      return conn.reply(m.chat, '🚩 *No se encontró un enlace de descarga.*', m);
    }

    await m.react('📤');
    await conn.sendMessage(m.chat, { 
      video: { url: data.url }, 
      caption: `🎈 *Tu video de Facebook (Resolución: ${data.resolution}) by KanBot.*`, 
      fileName: 'facebook_video.mp4', 
      mimetype: 'video/mp4' 
    }, { quoted: m });
    
    await m.react('✅');
    
  } catch (err) {
    console.error(err);
    await m.react('❌');
    return conn.reply(m.chat, '❌ *Error al procesar la descarga.*', m);
  }
};

handler.help = ['fb2'];
handler.tags = ['descargas'];
handler.command = ['facebook2', 'fb2'];
handler.group = true;

export default handler;