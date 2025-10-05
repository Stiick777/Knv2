// lib/safeSend.js
import delay from 'delay'

/**
 * Cola global de envíos para evitar rate limits.
 */
const sendQueue = []
let sending = false

export async function safeSend(conn, jid, content, options = {}, type = 'message') {
  return new Promise((resolve, reject) => {
    sendQueue.push({ conn, jid, content, options, resolve, reject, type })
    processQueue()
  })
}

async function processQueue() {
  if (sending) return
  sending = true

  while (sendQueue.length > 0) {
    const { conn, jid, content, options, resolve, reject, type } = sendQueue.shift()

    try {
      let res
      if (type === 'file') {
        res = await conn.sendFile(jid, content, options.filename || 'file', options.caption || '', options.quoted || null)
      } else {
        res = await conn.sendMessage(jid, content, options)
      }

      resolve(res)
      await delay(1500) // pausa entre cada envío
    } catch (e) {
      if (String(e).includes('rate-overlimit')) {
        console.log('[⚠️ RATE LIMIT] Esperando 5 segundos y reintentando...')
        await delay(5000)
        sendQueue.unshift({ conn, jid, content, options, resolve, reject, type }) // volver a encolar
      } else {
        console.error('[❌ Error en safeSend]', e)
        reject(e)
      }
    }
  }

  sending = false
}