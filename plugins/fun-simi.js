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
      headers: {  
        'Content-Type': 'application/x-www-form-urlencoded'  
      },  
      body: new URLSearchParams({  
        text: text,  
        lc: lang,  
        key: '' // Asegúrate de que la API no requiere clave o agrégala aquí  
      }).toString()  
    });  

    let json = await res.json(); 
    console.log(json);
    m.reply(json.message.replace(/simsimi/gi, ''), null, rcanal);  

  } catch (e) {  
    console.error(e);  
    m.reply(`❎ Error al conectar con la API. Intenta más tarde.`);  
  }  

}  

handler.help = ['bot'];  
handler.tags = ['fun'];  
handler.command = ['bot', 'simi'];   

export default handler;
