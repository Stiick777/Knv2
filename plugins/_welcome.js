import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}  
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://i.ibb.co/whpcLpM7/Screenshot-20250421-195814-2.png')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = 'HOLA! 🪐'
  let txt1 = 'ADIÓS🌙'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮\n` +
          `¡Bienvenido/a, ✰ @${m.messageStubParameters[0].split`@`[0]}\n A ${groupMetadata.subject}\n`+ `╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯\n` +
          `\n` + // Espacio adicional aquí
          `Esperamos que disfrutes tu estancia en el grupo.\n` +
          `*_Recuerda leer la descripción_*\n` +
          `🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁`    
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `╭══•🔥ೋ•๑♡๑•ೋ🔥•══╮\n` +
          `¡Adiós,✰ @${m.messageStubParameters[0].split`@`[0]}\n DE ${groupMetadata.subject}\n`+ `╰══•🔥ೋ•๑♡๑•ೋ🔥•══╯\n` +
          `\n` + // Espacio adicional aquí
          `Gracias por haber estado con nosotros.\n` +
          `🥀*ੈ✩‧₊˚༺☆༻*ੈ✩˚🍁`;
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak)
  }}
