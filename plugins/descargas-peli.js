import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
    if (!text) return m.reply('⚠️ Por favor, ingresa el nombre de la película.');

    try {
        // 1. Buscar la película en la API
        let searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(text)}`;
        let searchResponse = await fetch(searchUrl);
        let searchData = await searchResponse.json();

        if (!searchData.status || !searchData.result.data.length) {
            return m.reply('❌ No se encontraron resultados para la película.');
        }

        let firstMovie = searchData.result.data[0]; // Primer resultado

        // 2. Obtener detalles de la película
        let movieUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${encodeURIComponent(firstMovie.link)}`;
        let movieResponse = await fetch(movieUrl);
        let movieData = await movieResponse.json();

        if (!movieData.status || !movieData.result.data.dl_links) {
            return m.reply('❌ No se pudo obtener el enlace de descarga.');
        }

        // 3. Buscar el enlace SD 480p
        let sdLink = movieData.result.data.dl_links.find(link => link.quality === 'SD 480p');
        if (!sdLink) {
            return m.reply('❌ No se encontró un enlace en calidad SD 480p.');
        }

        // 4. Enviar la información y la película
        let message = `🎬 *${firstMovie.title}*\n📅 Año: ${firstMovie.year}\n⭐ IMDB: ${firstMovie.imdb}\n📥 *Descargando...*`;
        await conn.sendMessage(m.chat, { text: message }, { quoted: m });

        await conn.sendMessage(
            m.chat,
            {
                document: { url: sdLink.link },
                mimetype: 'video/mp4',
                fileName: `${firstMovie.title} (SD 480p).mp4`,
                caption: `🎬 *${firstMovie.title}*\n📅 Año: ${firstMovie.year}\n⭐ IMDB: ${firstMovie.imdb}\n✅ Descargado en SD 480p.`
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        return m.reply('❌ Ocurrió un error al procesar la solicitud.');
    }
};

handler.command = ['pelis'];
export default handler;