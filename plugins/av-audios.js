let handler = m => m
handler.all = async function (m) {
  for (const message in audioMsg) {
    if (new RegExp(`^${message}$`, 'i').test(m.text)) {
      await this.sendMessage(m.chat, {
        audio: { url: audioMsg[message] },
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: m })
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
