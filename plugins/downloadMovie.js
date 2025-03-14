import fetch from 'node-fetch';

const downloadMovie = async (conn, m, movieUrl) => {
  try {
    const apiUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${encodeURIComponent(movieUrl)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result?.data?.dl_links?.length) {
      return conn.sendMessage(m.chat, { text: '❌ No se encontraron enlaces de descarga.' }, { quoted: m });
    }

    // Buscar el enlace de calidad SD 480p con el dominio específico
    const sdLink = data.result.data.dl_links.find(link => 
      link.quality === "SD 480p" && link.link.includes("https://ddl.sinhalasub.net/AgADvB7001")
    );

    if (!sdLink) {
      return conn.sendMessage(m.chat, { text: '❌ No se encontró el enlace en calidad SD 480p con el dominio requerido.' }, { quoted: m });
    }

    // Enviar la película como documento
    await conn.sendMessage(m.chat, {
      document: { url: sdLink.link },
      mimetype: 'video/mp4',
      fileName: `${data.result.data.title}.mp4`,
      caption: `🎬 *${data.result.data.title}*\n📆 Año: ${data.result.data.date}\n📥 Descarga en calidad SD 480p`,
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al obtener la película.' }, { quoted: m });
  }
};

export default downloadMovie;