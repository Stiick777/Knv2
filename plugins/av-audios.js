import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'

let handler = m => m

handler.all = async function (m) {
  for (const message in audioMsg) {
    if (new RegExp(`^${message}$`, 'i').test(m.text)) {

      const tmpOgg = path.join(process.cwd(), `tmp_${Date.now()}.ogg`)

      // 1️⃣ Descargar como stream (NO guardar mp3)
      const res = await fetch(audioMsg[message])
      if (!res.ok) throw 'Error al descargar audio'

      const stream = res.body

      // 2️⃣ Convertir directo a OGG OPUS
      await new Promise((resolve, reject) => {
        ffmpeg(stream)
          .inputFormat('mp3')        // 👈 CLAVE
          .noVideo()
          .audioCodec('libopus')
          .audioBitrate('64k')
          .format('ogg')
          .on('end', resolve)
          .on('error', reject)
          .save(tmpOgg)
      })

      // 3️⃣ Enviar como nota de voz
      await this.sendMessage(m.chat, {
        audio: fs.readFileSync(tmpOgg),
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: m })

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
