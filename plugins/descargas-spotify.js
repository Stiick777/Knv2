// [ ❀ SPOTIFY PLAY ]    
import fetch from 'node-fetch';    

let handler = async (m, { conn, command, text }) => {    
  if (!text) return conn.reply(m.chat, '❀ Ingresa el texto de lo que quieras buscar', m);    

  try {    
    // Búsqueda en Spotify    
    let apiSearch = await fetch(`https://api.agungny.my.id/api/spotifys?q=${encodeURIComponent(text)}`);    
    let jsonSearch = await apiSearch.json();    

    if (!jsonSearch.status || !jsonSearch.result.length) {    
      return conn.reply(m.chat, '❀ No se encontraron resultados.', m);    
    }    

    let { name, artists, link, image, duration_ms } = jsonSearch.result[0];    

    // Descarga de Spotify    
    let apiDL = await fetch(`https://api.agungny.my.id/api/spotify?url=${encodeURIComponent(link)}`);    
    let jsonDL = await apiDL.json();    

    if (!jsonDL.status) {    
      return conn.reply(m.chat, '❀ No se pudo descargar la canción.', m);    
    }    

    let { title, download, image: songImage, duration_ms: songDuration } = jsonDL.result;    

    let HS = `    
❀ *Spotify Play*    

- 🎵 *Título:* ${title}    
- 🎤 *Artista:* ${artists}    
- ⏳ *Duración:* ${(songDuration / 1000).toFixed(0)}s    
- 🔗 *Spotify Link:* ${link}    
- 📥 *Descargar:* [Click aquí](${download})    
    `.trim();    

    // Enviar imagen con el texto    
    await conn.sendFile(m.chat, songImage, 'spotify.jpg', HS, m);    

    // Descargar el audio antes de enviarlo    
    let audioBuffer = await (await fetch(download)).buffer();    

    // Enviar el audio como mensaje de audio    
    await conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mp3' }, { quoted: m });    

  } catch (error) {    
    console.error(error);    
    conn.reply(m.chat, '❀ Ocurrió un error al procesar la solicitud.', m);    
  }    
};    

handler.command = /^(spotify)$/i;    
handler.tags = ['descargas'];  
handler.help = ['spotify <texto>'];  
handler.group = true;    

export default handler;