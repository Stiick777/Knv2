import downloadMovie from './downloadMovie.js'; // Importar el módulo

const handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: '⚠️ Ingresa el nombre de la película que deseas buscar.' }, { quoted: m });

  try {
    const url = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.status || !data.result?.data?.length) {
      return conn.sendMessage(m.chat, { text: '❌ No se encontraron resultados.' }, { quoted: m });
    }

    const movie = data.result.data[0]; // Primer resultado

    await conn.sendMessage(m.chat, { 
      text: `🎬 *${movie.title}*\n📆 Año: ${movie.year}\n⭐ IMDB: ${movie.imdb}\n🔗 [Ver película](${movie.link})`
    }, { quoted: m });

    // Llamar a la función para descargar la película
    await downloadMovie(conn, m, movie.link);

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al buscar la película.' }, { quoted: m });
  }
};

handler.command = ['pelis'];
export default handler;