import downloadMovie from './downloadMovie.js'; // Importar el módulo

const handler = async (m, { text }) => {
  if (!text) return m.reply('⚠️ Ingresa el nombre de la película que deseas buscar.');

  try {
    const url = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.status || !data.result?.data?.length) {
      return m.reply('❌ No se encontraron resultados.');
    }

    const movie = data.result.data[0]; // Primer resultado

    await m.reply(`🎬 *${movie.title}*\n📆 Año: ${movie.year}\n⭐ IMDB: ${movie.imdb}\n🔗 [Ver película](${movie.link})`);

    // Llamar a la función para descargar la película
    await downloadMovie(m, movie.link);

  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al buscar la película.');
  }
};

handler.command = ['pelis'];
export default handler;