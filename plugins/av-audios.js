
let handler = m => m
handler.all = async function (m) {
  for (const message in audioMsg) {
    if (new RegExp(`^${message}$`, 'i').test(m.text)) {
      this.sendFile(m.chat, audioMsg[message], 'audio.mp3', null, m, true)
      break
    }
  }
  return !0
 }

export default handler


let audioMsg = {
  'nadie te preguntó': 'https://qu.ax/cyWlY.mp3',
  'Nadie te pregunto': 'https://qu.ax/cyWlY.mp3'
  
}

