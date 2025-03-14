import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('⚠️ Ingresa el nombre de la película que deseas buscar.');

  try {
    // Paso 1: Buscar la película en la API
    const searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.status || !searchData.result?.data?.length) {
      return m.reply('❌ No se encontraron resultados para esa película.');
    }

    const movie = searchData.result.data[0]; // Primer resultado
    const movieUrl = movie.link;

    // Paso 2: Obtener los links de descarga de la película
    const detailsUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${encodeURIComponent(movieUrl)}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsData.status || !detailsData.result?.data?.dl_links?.length) {
      return m.reply('❌ No se encontraron enlaces de descarga para esta película.');
    }

    // Buscar el link de calidad SD 480p
    const sdLink = detailsData.result.data.dl_links.find(link => link.quality === 'SD 480p');

    if (!sdLink) {
      return m.reply('❌ No se encontró un enlace en calidad SD 480p.');
    }

    const { title, year, imdbRate, image } = detailsData.result.data;

    // Mensaje con información de la película
    const message = `🎬 *${title}*\n📆 Año: ${year}\n⭐ IMDB: ${imdbRate}\n🔗 [Ver detalles](${movieUrl})\n\n📥 *Descargando en calidad SD 480p...*`;

    await m.reply(message);

    // Paso 3: Descargar y enviar el archivo en WhatsApp
    const docMessage = {
      document: { url: sdLink.link },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption: `🎬 *${title}*\n📥 Calidad: SD 480p (${sdLink.size})`,
      thumbnail: await fetch(image).then(res => res.buffer()),
    };

    await conn.sendMessage(m.chat, docMessage, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al procesar la solicitud.');
  }
};

handler.command = ['pelis'];
export default handler;