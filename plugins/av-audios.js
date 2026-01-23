import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'

ffmpeg.setFfmpegPath(ffmpegPath)

let handler = m => m

handler.all = async function (m) {
  for (const message in audioMsg) {
    if (new RegExp(`^${message}$`, 'i').test(m.text)) {

      const tmpMp3 = path.join(process.cwd(), `tmp_${Date.now()}.mp3`)
      const tmpOgg = tmpMp3.replace('.mp3', '.ogg')

      // 1️⃣ Descargar MP3
      const res = await fetch(audioMsg[message])
      const buffer = await res.arrayBuffer()
      fs.writeFileSync(tmpMp3, Buffer.from(buffer))

      // 2️⃣ Convertir a OGG OPUS (nota de voz)
      await new Promise((resolve, reject) => {
        ffmpeg(tmpMp3)
          .audioCodec('libopus')
          .audioBitrate('64k')
          .format('ogg')
          .on('end', resolve)
          .on('error', reject)
          .save(tmpOgg)
      })

      // 3️⃣ Enviar como PTT real
      await this.sendMessage(m.chat, {
        audio: fs.readFileSync(tmpOgg),
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: m })

      // 4️⃣ Limpiar archivos temporales
      fs.unlinkSync(tmpMp3)
      fs.unlinkSync(tmpOgg)

      break
    }
  }
  return !0
}

export default handler

let audioMsg = {
  'nadie te preguntó': 'https://qu.ax/cyWlY.mp3',
  'nadie te pregunto': 'https://qu.ax/cyWlY.mp3'
}
