import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🔹 *Uso:* Escribe un texto para generar el sticker.\nEjemplo: .brat Hola');
  
  try {
    let url = `https://api.agungny.my.id/api/bratv1?q=${encodeURIComponent(text)}`;
    let res = await fetch(url);
    if (!res.ok) throw new Error('No se pudo obtener la imagen');
    
    let buffer = await res.buffer();
    
    await conn.sendMessage(m.chat, { 
      sticker: buffer 
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Error al generar el sticker.');
  }
};

handler.command = /^brat$/i;
export default handler;