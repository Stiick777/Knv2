/*import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('*Ingresa el nombre de la canción*')
  await m.react('🕓')

  try {

    const res = await fetch(`https://api.ootaizumi.web.id/downloader/youtube/play?query=${encodeURIComponent(text)}`)
    const data = await res.json()

    if (!data.status) throw new Error('La API no devolvió resultados')

    const v = data.result

    await conn.sendMessage(
      m.chat,
      {
        image: { url: v.thumbnail },
        caption: `🎵 *${v.title}*\n👤 ${v.author.name}\n⏱ ${v.timestamp}`
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: v.download },
        mimetype: 'audio/mpeg',
        fileName: `${v.title}.mp3`,
        ptt: false
      },
      {
        quoted: m,
        fetchOptions: {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://youtube.com/"
          }
        }
      }
    )

    await m.react('✔️')

  } catch (e) {
    console.error(e)
    m.reply(`⚠️ Error:\n${e.message}`)
  }
}

handler.help = ['play <texto>']
handler.tags = ['descargas']
handler.command = ['play']

export default handler
*/
