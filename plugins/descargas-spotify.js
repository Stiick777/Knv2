// [ ❀ SPOTIFY PLAY ]  
import fetch from 'node-fetch';  

let handler = async (m, { conn, command, text, usedPrefix }) => {  
  if (!text) return conn.reply(m.chat, '❀ Ingresa el texto de lo que quieras buscar', m);  

  try {  
    // Búsqueda en Spotify  
    let apiSearch = await fetch(`https://api.davidcyriltech.my.id/search/spotify?text=${encodeURIComponent(text)}`);  
    let jsonSearch = await apiSearch.json();  

    if (!jsonSearch.success || !jsonSearch.result.length) {  
      return conn.reply(m.chat, '❀ No se encontraron resultados.', m);  
    }  

    let { trackName, artistName, albumName, duration, externalUrl } = jsonSearch.result[0];  

    // Descarga de Spotify  
    let apiDL = await fetch(`https://api.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(externalUrl)}`);  
    let jsonDL = await apiDL.json();  

    if (!jsonDL.success) {  
      return conn.reply(m.chat, '❀ No se pudo descargar la canción.', m);  
    }  

    let { title, channel, duration: songDuration, thumbnail, DownloadLink } = jsonDL;  

    let HS = `  
❀ *Spotify Play*  

- 🎵 *Título:* ${title}  
- 🎤 *Artista:* ${channel}  
- ⏳ *Duración:* ${songDuration}  
- 🔗 *Spotify Link:* ${externalUrl}  
- 📥 *Descargar:* [Click aquí](${DownloadLink})  
    `.trim();  

    await conn.sendFile(m.chat, thumbnail, 'spotify.jpg', HS, m);  
    await conn.sendFile(m.chat, DownloadLink, `${title}.mp3`, null, m);  

  } catch (error) {  
    console.error(error);  
    conn.reply(m.chat, '❀ Ocurrió un error al procesar la solicitud.', m);  
  }  
};  

handler.command = /^(spotify)$/i;  

export default handler;