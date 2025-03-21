import yts from 'yt-search';

const handler = async (m, { text, conn, command, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, `🏳 *Escriba el título de algún vídeo de YouTube*\n\nEjemplo: ${usedPrefix + command} heyser`, m, rcanal);

    let results = await yts(text);
    let videos = results.videos.slice(0, 6); // Máximo 4 videos para el carrusel

    if (!videos.length) return conn.reply(m.chat, '⚠️ No se encontraron resultados.', m, rcanal);

let messages = videos.map(video => [
    video.title,
    `🎬 *Título:* ${video.title}\n⏱ *Duración:* ${video.timestamp}\n📅 *Subido:* ${video.ago}\n🎈 para descargar copee y pegue el comando:\n⟨∆⟩ boton 1 mp3\n⟨∆⟩ boton 2 mp4\n\n「✰」 provided by KanBot`,
    video.thumbnail,
    [[]], [ [ `/ytmp3 ${video.url}`], [ `/ytmp4 ${video.url}`] ]
]);

await conn.sendCarousel(m.chat, `🔎 Resultados para: *${text}*`, '📺 YouTube Search', null, messages, m);
};

handler.help = ['ytsearch'];
handler.tags = ['buscador'];
handler.command = /^playlist|ytbuscar|yts(earch)?$/i;
handler.group = true;

export default handler;

/*

let handler = async (m, { conn, usedPrefix, text, args, command }) => {        
    if (!text) throw `✳️ Ejemplo: *${usedPrefix + command}* Lil Peep hate my life`;        
    m.react('📀');        
            
    let result = await yts(text);        
    let ytres = result.videos;        
            
    let listSections = [];        
    for (let index in ytres) {        
        let v = ytres[index];        
        listSections.push({        
            title: `${index}┃ ${v.title}`,        
            rows: [        
                {        
                    header: '🎶 MP3',        
                    title: "",        
                    description: `▢ ⌚ *Duración:* ${v.timestamp}\n▢ 👀 *Vistas:* ${v.views}\n▢ 📌 *Título:* ${v.title}\n▢ 📆 *Publicado:* ${v.ago}\n`,         
                    id: `${usedPrefix}yta ${v.url}`        
                },        
                {        
                    header: "🎥 MP4",        
                    title: "" ,        
                    description: `▢ ⌚ *Duración:* ${v.timestamp}\n▢ 👀 *Vistas:* ${v.views}\n▢ 📌 *Título:* ${v.title}\n▢ 📆 *Publicado:* ${v.ago}\n`,         
                    id: `${usedPrefix}ytv ${v.url}`        
                }        
            ]        
        });        
    }        
        
    await conn.sendList(m.chat, '  ≡ *YT-SEARCH MUSIC*🔎', `\n 📀 Resultados de: *${text}*\n\nKanBot by Stiiven`, `Click Aquí`, ytres[0].image, listSections, m);        
};        
        
handler.help = ['yts']        
handler.tags = ['search']        
handler.command = ['yts', 'ytsearch']         
handler.disabled = false        
handler.group = true        
        
export default handler;
*/
