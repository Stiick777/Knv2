import fetch from 'node-fetch'  
let handler = async (m, { conn, text, usedPrefix, command }) => {  

  let lang = 'es'; // Siempre usar español  

  if (!text) {  
    return m.reply(`✳️ No has ingresado ningún texto.`);  
  }  

  m.react('🗣️');   

  try {   
    let res = await fetch('https://api.simsimi.vn/v1/simtalk', {  
      method: 'POST',  
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  
      body: `text=${encodeURIComponent(text)}&lc=${lang}&key=`  
    });  

    let json = await res.json();  
    m.reply(json.message.replace(/simsimi/gi, ''), null, rcanal);  

  } catch {  
    m.reply(`❎ Intenta de nuevo más tarde. La API de SimSimi no está disponible en este momento.`);  
  }  

}  

handler.help = ['bot'];  
handler.tags = ['fun'];  
handler.command = ['bot', 'simi'];   

export default handler;
