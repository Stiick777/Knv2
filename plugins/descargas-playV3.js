import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('*Ingresa el nombre de lo que quieres buscar*')
  await m.react('🕓')

  try {

    const api = await fetch(`https://api.zenzxz.my.id/download/youtube?q=${encodeURIComponent(text)}&type=mp3&quality=360`)
    const data = await api.json()

    if (!data.status) return m.reply('❌ No se pudo encontrar el audio')

    const cap = `
𝚈𝚘𝚞𝚝𝚞𝚋𝚎 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊
===========================
> *Título:* ${data.result.title}
> *Autor:* ${data.result.author}
> *Calidad:* ${data.result.quality}

*🚀 Enviando audio...*
===========================
✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰
`.trim()

    await conn.sendFile(
      m.chat,
      data.result.thumbnail,
      "thumbnail.jpg",
      cap,
      m
    )
await conn.sendMessage(
  m.chat,
  {
    audio: { url: data.result.download },
    mimetype: 'audio/mpeg',
    fileName: data.result.filename,
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
