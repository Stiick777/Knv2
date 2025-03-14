import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
    if (!args.length) return conn.reply(m.chat, '⚠️ Ingresa el nombre de la película. Ejemplo: .pelis Deadpool', m);

    let query = encodeURIComponent(args.join(' '));
    let searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${query}`;

    try {
        // Buscar la película
        let searchRes = await fetch(searchUrl);
        let searchData = await searchRes.json();

        if (!searchData.status || !searchData.result?.data.length) {
            return conn.reply(m.chat, '❌ No se encontró la película.', m);
        }

        let movie = searchData.result.data[0]; // Primer resultado
        let movieUrl = movie.link;

        // Obtener los enlaces de descarga
        let movieApiUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${movieUrl}`;
        let movieRes = await fetch(movieApiUrl);
        let movieData = await movieRes.json();

        if (!movieData.status || !movieData.result?.data.dl_links) {
            return conn.reply(m.chat, '❌ No se pudo obtener los enlaces de descarga.', m);
        }

        // Filtrar la calidad SD 480p
        let downloadLink = movieData.result.data.dl_links.find(dl => dl.quality === 'SD 480p');
        if (!downloadLink) return conn.reply(m.chat, '❌ No hay versión en SD 480p disponible.', m);

        let caption = `🎬 *${movie.title}*\n📆 Año: ${movie.year}\n⭐ ${movie.imdb}\n📎 [Ver en la web](${movie.link})\n📥 [Descargar SD 480p](${downloadLink.link})`;

        // Enviar la imagen de la película con información
        await conn.sendMessage(m.chat, {
            image: { url: movie.image },
            caption
        });

        // Enviar la película como documento
        await conn.sendMessage(m.chat, {
            document: { url: downloadLink.link },
            mimetype: 'video/mp4',
            fileName: `${movie.title} (SD 480p).mp4`
        });

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al buscar la película.', m);
    }
};

handler.command = ['pelis'];
export default handler;