import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('*Ingresa el nombre de la canción*')
  await m.react('🕓')

  try {

    const res = await fetch(`https://api.ootaizumi.web.id/downloader/youtube/play?query=${encodeURIComponent(text)}`)
    const data = await res.json()

    if (!data.status) throw new Error('La API no devolvió resultados')

    const v = data.result

    const caption = `
╭─〔 YOUTUBE PLAY 〕
│
├ Título: ${v.title}
├ Autor: ${v.author.name}
├ Duración: ${v.timestamp}
│
╰ Enviando audio...
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: v.thumbnail },
        caption
      },
      { quoted: m }
    )

    // 📥 descargar audio primero
    const audio = await fetch(v.download)
    const buffer = await audio.buffer()

    // 🎵 enviar audio
    await conn.sendMessage(
      m.chat,
      {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${v.title}.mp3`,
        ptt: false
      },
      { quoted: m }
    )

    await m.react('✔️')

  } catch (e) {
    console.error(e)
    m.reply(`⚠️ Error al descargar el audio\n\n${e.message}`)
  }
}

handler.help = ['play <canción>']
handler.tags = ['descargas']
handler.command = ['play']

export default handler
