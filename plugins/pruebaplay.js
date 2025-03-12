import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios'
import fs from 'fs'
import { exec } from 'child_process'

const handler = async (m, {conn, command, args, text, usedPrefix}) => {
    if (command == 'playtt') {
    if (!text) return conn.reply(m.chat, `*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*`, m, );
    
    await m.react('🕓'); 

    const yt_play = await search(args.join(' '));
    const texto1 = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜
===========================

> *𝚃𝚒𝚝𝚞𝚕𝚘* :  ${yt_play[0].title}

> *𝙲𝚛𝚎𝚊𝚍𝚘* :  ${yt_play[0].ago}

> *𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗* :  ${secondString(yt_play[0].duration.seconds)}

*🚀 𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊*

===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
> *Provided by Stiiven
`.trim();

    await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m, null);


try {  
    await m.react('🕓'); // Reacciona con un ícono de reloj mientras procesa  

    // URL de la API con el enlace de YouTube  
    const apiUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(yt_play[0].url)}`;  
    let apiResponse = await fetch(apiUrl);  
    let response = await apiResponse.json();  

    // Verificar si la API devolvió un resultado válido  
    if (response.status === true && response.data && response.data.dl) {  
        const { dl, title } = response.data;  

        await conn.sendMessage(m.chat, {  
            audio: { url: dl },  
            mimetype: 'audio/mp4', // Asegurar compatibilidad con WhatsApp  
            ptt: false, // Enviar como audio normal, no nota de voz  
            fileName: `${title}.mp3`,  
        }, { quoted: m });  

        return await m.react('✅'); // Reaccionar con éxito  
    }  

    throw new Error("API falló o no retornó datos válidos");  
} catch (error) {  
    console.warn("Error en la API:", error.message);  
    await m.reply("❌ Error al procesar la solicitud. Inténtalo de nuevo.");  
}


}

}

// Configuración del handler  
//handler.help = ['playtt'];  
//handler.tags = ['descargas'];  
handler.command = ['playtt'];  
handler.group = true;  

export default handler;