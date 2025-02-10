import axios from 'axios';
import fetch from 'node-fetch';

async function buscarSpotify(query) {
    try {
        let response = await axios.get(`https://api.davidcyriltech.my.id/search/spotify?text=${encodeURIComponent(query)}`);
        if (!response.data.success || !response.data.result.length) throw '*No se encontró la canción*';
        return response.data.result[0]; // Toma el primer resultado
    } catch (error) {
        console.error('Error en buscarSpotify:', error.message);
        throw '*Error al buscar la canción en Spotify*';
    }
}

async function descargarSpotify(url) {
    try {
        let response = await axios.get(`https://api.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        if (!response.data.success) throw '*No se pudo descargar la canción*';
        return response.data;
    } catch (error) {
        console.error('Error en descargarSpotify:', error.message);
        throw '*Error al descargar la canción de Spotify*';
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `╰⊱❗️⊱ *USO INCORRECTO* ⊱❗️⊱╮\n\nEjemplo:\n${usedPrefix + command} *Faded*`;

    try {
        m.react('🕑');

        // Buscar la canción en Spotify
        let res = await buscarSpotify(text);
        console.log('Búsqueda exitosa:', res);

        // Descargar la canción usando la API
        let resDownload = await descargarSpotify(res.externalUrl);
        console.log('Descarga exitosa:', resDownload);

        // Descargar la imagen (thumbnail)
        let thumbBuffer;
        try {
            let thumbResponse = await fetch(resDownload.thumbnail);
            thumbBuffer = await thumbResponse.buffer();
        } catch (error) {
            console.error('Error al descargar la imagen:', error.message);
            thumbBuffer = null;
        }

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

        // Enviar imagen con información
        if (thumbBuffer) {
            await conn.sendFile(m.chat, resDownload.thumbnail, 'thumb.jpg', info, m);
        } else {
            await conn.sendMessage(m.chat, { text: info }, { quoted: m });
        }

        // Enviar el audio
        await conn.sendMessage(m.chat, { 
            audio: { url: resDownload.DownloadLink }, 
            fileName: `${resDownload.title}.mp3`, 
            mimetype: 'audio/mpeg' 
        }, { quoted: m });

        m.react('✅');
    } catch (error) {
        console.error('Error en handler:', error);
        m.reply(error.toString());
    }
};

handler.tags = ['descargas'];
handler.help = ['spotify'];
handler.command = ['spotify', 'spoty'];
export default handler;