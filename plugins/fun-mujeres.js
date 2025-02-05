
let handler = async (m, { conn, usedPrefix, command }) => {

  const imageUrl = 'https://m.media-amazon.com/images/I/61rXThZoicL.jpg';
  
  await conn.sendFile(m.chat, imageUrl, 'imagen.jpg', '', m);
  
  m.react('😓');
};

handler.help = ['imagen'];
handler.tags = ['fun'];
handler.command = ['todasmienten']; 
handler.group = true;  

export default handler;
