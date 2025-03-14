import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('⚠️ Ingresa el nombre de la película que deseas buscar.');

  try {
    // 1️⃣ Buscar la película en la API
    const searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.status || !searchData.result?.data?.length) {
      return m.reply('❌ No se encontraron resultados para esa película.');
    }

    const movie = searchData.result.data[0]; // Tomar el primer resultado

    // 2️⃣ Obtener detalles de la película
    const detailsUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${encodeURIComponent(movie.link)}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsData.status || !detailsData.result?.data) {
      return m.reply('❌ No se pudieron obtener detalles de la película.');
    }

    const movieDetails = detailsData.result.data;

    // 3️⃣ Buscar el enlace de descarga en calidad SD 480p
    const downloadLink = movieDetails.dl_links.find(link => link.quality === 'SD 480p' && link.link.includes('ddl.sinhalasub.net'));

    if (!downloadLink) {
      return m.reply('❌ No se encontró un enlace de descarga en calidad SD 480p.');
    }

    // 4️⃣ Enviar la película como documento
    const caption = `🎬 *${movieDetails.title}*\n📆 Fecha: ${movieDetails.date}\n🌍 País: ${movieDetails.country}\n⏳ Duración: ${movieDetails.runtime}\n⭐ IMDB: ${movieDetails.imdbRate}/10\n📥 Descarga en SD 480p (${downloadLink.size}): ${downloadLink.link}`;
    
    await conn.sendMessage(m.chat, { document: { url: downloadLink.link }, mimetype: 'video/mp4', fileName: `${movieDetails.title}.mp4`, caption }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al procesar la solicitud.');
  }
};

handler.command = ['pelis'];
export default handler;