import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('⚠️ Ingresa el nombre de la película.');

  try {
    // Paso 1: Buscar la película
    const searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.status || !searchData.result?.data?.length) {
      return m.reply('❌ No se encontraron resultados.');
    }

    const movie = searchData.result.data[0]; // Primer resultado
    const movieUrl = movie.link;

    // Paso 2: Obtener los detalles de la película
    const detailsUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${encodeURIComponent(movieUrl)}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsData.status || !detailsData.result?.data?.dl_links?.length) {
      return m.reply('❌ No se encontraron enlaces de descarga.');
    }

    // Buscar el link en calidad SD 480p
    const sdLink = detailsData.result.data.dl_links.find(link => link.quality === 'SD 480p');

    if (!sdLink) {
      return m.reply('❌ No se encontró un enlace en calidad SD 480p.');
    }

    // Enviar la película como documento
    await conn.sendMessage(m.chat, {
      document: { url: sdLink.link },
      mimetype: 'video/mp4',
      fileName: `Pelicula.mp4`
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al procesar la solicitud.');
  }
};

handler.command = ['pelis'];
export default handler;