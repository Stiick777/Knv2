import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('*Ingresa el nombre de la canción*')
  await m.react('🕓')

  try {

    const res = await fetch(`https://api-faa.my.id/faa/ytplay?query=${encodeURIComponent(text)}`)
    const data = await res.json()

    if (!data.status) return m.reply('❌ No se encontraron resultados')

    const { title, mp3, thumbnail, duration, views, author } = data.result

    const cap = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙿𝚕𝚊𝚢
===========================
> *Título:* ${title}
> *Autor:* ${author}
> *Duración:* ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}
> *Vistas:* ${views.toLocaleString()}

*🚀 Enviando audio...*
===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
`.trim()

    // 📷 Enviar info con miniatura
    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumbnail },
        caption: cap
      },
      { quoted: m }
    )

    // 🎵 Enviar audio correctamente
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: mp3 },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: false
      },
      { quoted: m }
    )

    await m.react('✔️')

  } catch (error) {
    console.error(error)
    m.reply('⚠️ Error al descargar el audio')
  }
}

handler.help = ['play <texto>']
handler.tags = ['descargas']
handler.command = ['play']

export default handler
