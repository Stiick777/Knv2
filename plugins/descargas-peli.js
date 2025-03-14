import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.sendMessage(m.chat, { text: '⚠️ Ingresa el nombre de la película que deseas buscar.' }, { quoted: m });
  }

  try {
    // 🔍 Buscar la película
    const searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.status || !searchData.result?.data?.length) {
      return conn.sendMessage(m.chat, { text: '❌ No se encontraron resultados.' }, { quoted: m });
    }

    const movie = searchData.result.data[0]; // Primer resultado encontrado

    // 🔗 Obtener detalles y enlaces de descarga
    const movieUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${encodeURIComponent(movie.link)}`;
    const movieResponse = await fetch(movieUrl);
    const movieData = await movieResponse.json();

    if (!movieData.status || !movieData.result?.data?.dl_links?.length) {
      return conn.sendMessage(m.chat, { text: '❌ No se encontraron enlaces de descarga.' }, { quoted: m });
    }

    // 🔎 Buscar el enlace de calidad SD 480p con el dominio correcto
    const sdLink = movieData.result.data.dl_links.find(link => 
      link.quality === "SD 480p" && link.link.includes("https://ddl.sinhalasub.net/AgADvB7001")
    );

    if (!sdLink) {
      return conn.sendMessage(m.chat, { text: '❌ No se encontró el enlace en calidad SD 480p con el dominio requerido.' }, { quoted: m });
    }

    // 📩 Enviar detalles de la película antes de la descarga
    await conn.sendMessage(m.chat, { 
      image: { url: movieData.result.data.image }, 
      caption: `🎬 *${movieData.result.data.title}*\n📆 Año: ${movieData.result.data.date}\n🌍 País: ${movieData.result.data.country}\n⭐ IMDB: ${movieData.result.data.imdbRate} (${movieData.result.data.imdbVoteCount} votos)\n📥 Calidad: SD 480p\n🎞️ Categoría: ${movieData.result.data.category.join(', ')}\n🎭 Director: ${movieData.result.data.director}\n📄 Sinopsis: ${movieData.result.data.description}`
    }, { quoted: m });

    // 📁 Enviar la película como documento
    await conn.sendMessage(m.chat, {
      document: { url: sdLink.link },
      mimetype: 'video/mp4',
      fileName: `${movieData.result.data.title}.mp4`,
      caption: `🎬 *${movieData.result.data.title}*\n📥 Descarga en calidad SD 480p`,
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al obtener la película.' }, { quoted: m });
  }
};

handler.command = ['pelis'];
export default handler;