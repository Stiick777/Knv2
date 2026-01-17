import { convert } from './ezgif-convert.js'
import { Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'
import crypto from 'crypto'
import fetch from 'node-fetch'

const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/

function randomName() {
  return crypto.randomBytes(6).toString('hex')
}

async function bufferFromUrl(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('No se pudo descargar el archivo convertido')
  return Buffer.from(await res.arrayBuffer())
}

async function webp2png(source) {
  const isUrl = typeof source === 'string' && urlRegex.test(source)

  let ext = 'webp'
  if (!isUrl) {
    const type = await fileTypeFromBuffer(source)
    ext = type?.ext || 'webp'
  }

  const filename = `${randomName()}.${ext}`

  const payload = isUrl
    ? { url: source }
    : { file: new Blob([source]), filename }

  // 🔹 Intento principal: PNG
  try {
    const res = await convert({
      type: 'webp-png',
      ...payload
    })

    if (Buffer.isBuffer(res)) return res
    if (res?.url) return await bufferFromUrl(res.url)

    throw new Error('Respuesta inválida de ezgif (png)')
  } catch (e) {
    console.error('[webp2png] PNG falló, intentando JPG')
  }

  // 🔹 Fallback: JPG
  try {
    const res = await convert({
      type: 'webp-jpg',
      ...payload
    })

    if (Buffer.isBuffer(res)) return res
    if (res?.url) return await bufferFromUrl(res.url)

    throw new Error('Respuesta inválida de ezgif (jpg)')
  } catch (e) {
    console.error('[webp2png] JPG falló')
    throw e
  }
}

export { webp2png }
