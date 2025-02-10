import axios from 'axios';
import fetch from 'node-fetch';

async function buscarSpotify(query) {
    let response = await axios.get(`https://api.davidcyriltech.my.id/search/spotify?text=${encodeURIComponent(query)}`);
    if (!response.data.success || !response.data.result.length) throw '*No se encontró la canción*';
    return response.data.result[0]; // Toma el primer resultado
}

async function descargarSpotify(url) {
    let response = await axios.get(`https://api.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
    if (!response.data.success) throw '*No se pudo descargar la canción*';
    return response.data;
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `╰⊱❗️⊱ *USO INCORRECTO* ⊱❗️⊱╮\n\nEjemplo:\n${usedPrefix + command} *Faded*`;

    try {
        m.react('🕑');

        // Buscar la canción en Spotify
        let res = await buscarSpotify(text);
        let resDownload = await descargarSpotify(res.externalUrl); // Descargar usando el link de Spotify

        // Descargar la imagen (thumbnail)
        let thumbResponse = await fetch(resDownload.thumbnail);
        let thumbBuffer = await thumbResponse.buffer();

        // Mensaje con información (sin el link de descarga)
        const info = `🍟 *TÍTULO:*  
_${resDownload.title}_  

🚩 *ARTISTA:*  
» ${resDownload.channel}  

⏳ *DURACIÓN:*  
» ${resDownload.duration} segundos  

🖼 *ÁLBUM:*  
» ${res.albumName}  

🔗 *LINK:*  
» ${res.externalUrl}  

✨️ *Enviando Canción....*  
${global.wm}`;

        // Enviar imagen con la información usando sendFile
        await conn.sendFile(m.chat, resDownload.thumbnail, 'thumb.jpg', info, m);

        // Enviar el audio
        await conn.sendMessage(m.chat, { 
            audio: { url: resDownload.DownloadLink }, 
            fileName: `${resDownload.title}.mp3`, 
            mimetype: 'audio/mpeg' 
        }, { quoted: m });

        m.react('✅');
    } catch (error) {
        console.error(error);
        m.reply('*Ocurrió un error al procesar tu solicitud*');
    }
};

handler.tags = ['descargas'];
handler.help = ['spotify'];
handler.command = ['spotify', 'spoty'];
export default handler;