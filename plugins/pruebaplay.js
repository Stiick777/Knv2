import { ytdlaudtxt } from 'savetubedl';

async function handler(m, { text }) {  
    if (!text) {  
        return m.reply('*𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎 𝚕𝚘 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚋𝚞𝚜𝚌𝚊𝚛*');  
    }  

    await m.react('🕓');  

    try {  
        // Buscar video en YouTube  
        const videoInfo = await ytdlaudtxt(text, '480');  

        // Mostrar en consola  
        console.log('🔹 Video Info:', videoInfo);  

        // Enviar la respuesta al chat  
        await m.reply(`🔹 *Video Info:*  
\`\`\`json
${JSON.stringify(videoInfo, null, 2)}
\`\`\``);  

        await m.react('✅'); // Indicar éxito  

    } catch (error) {  
        console.error('❌ Error en la búsqueda:', error.message);  
        await m.react('❌');  
        await m.reply('*Ocurrió un error al buscar el video.*');  
    }  
}

// Configuración del handler  
handler.help = ['playtt'];  
handler.tags = ['descargas'];  
handler.command = ['playtt'];  
handler.group = true;  

export default handler;