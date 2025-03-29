import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let lang = 'es'  
  if (!text) return m.reply('✳️ Debes escribir algo para que responda.')

  m.react('🗣️')   
  try {   
    let res = await fetch('https://api.simsimi.vn/v1/simtalk', {  
      method: 'POST',  
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  
      body: `text=${encodeURIComponent(text)}&lc=${lang}&key=`  
    })  
    let json = await res.json()
    
    m.reply(json.message.replace(/simsimi|sim simi/gi, ''))
  } catch {  
    m.reply('❎ Intenta de nuevo más tarde. La API de SimSimi no responde.')  
  }  
}

handler.help = ['bot']  
handler.tags = ['fun']  
handler.command = ['bot', 'simi']   

export default handler
