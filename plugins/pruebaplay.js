import { ytdltxt } from 'savetubedl';

async function handler(m, { text }) {  
    if (!text) {  
        return m.reply('*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*');  
    }  

    await m.react('🕓');  

    try {  
        // Buscar video en YouTube  
        const videoInfo = await ytdltxt(text, '480');  

        // Verificar información en consola antes de enviarla  
        console.log('🔹 Video Info:', videoInfo);  

        await m.react('✅'); // Indicar éxito  

    } catch (error) {  
        console.error('❌ Error en la búsqueda:', error.message);  
        await m.react('❌');  
    }  
}

// Configuración del handler  
handler.help = ['playtt'];  
handler.tags = ['descargas'];  
handler.command = ['playtt'];  
handler.group = true;  

export default handler;