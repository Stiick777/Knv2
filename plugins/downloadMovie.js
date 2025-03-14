import fetch from 'node-fetch';

const downloadMovie = async (m, movieUrl) => {
  try {
    const apiUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${encodeURIComponent(movieUrl)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result?.data?.dl_links?.length) {
      return m.reply('❌ No se encontraron enlaces de descarga.');
    }

    // Buscar el enlace de calidad SD 480p con el dominio específico
    const sdLink = data.result.data.dl_links.find(link => 
      link.quality === "SD 480p" && link.link.includes("https://ddl.sinhalasub.net/AgADvB7001")
    );

    if (!sdLink) {
      return m.reply('❌ No se encontró el enlace en calidad SD 480p con el dominio requerido.');
    }

    // Enviar la película como documento
    await m.sendMessage(m.chat, {
      document: { url: sdLink.link },
      mimetype: 'video/mp4',
      fileName: `${data.result.data.title}.mp4`,
      caption: `🎬 *${data.result.data.title}*\n📆 Año: ${data.result.data.date}\n📥 Descarga en calidad SD 480p`,
    });

  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al obtener la película.');
  }
};

export default downloadMovie;