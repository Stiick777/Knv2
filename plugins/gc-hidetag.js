/*import {generateWAMessageFromContent} from '@whiskeysockets/baileys';
import * as fs from 'fs';
const handler = async (m, {conn, text, participants, isOwner, isAdmin}) => {
  try {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const q = m.quoted ? m.quoted : m || m.text || m.sender;
    const c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender;
    const msg = conn.cMod(m.chat, generateWAMessageFromContent(m.chat, {[m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : {text: '' || c}}, {quoted: m, userJid: conn.user.id}), text || q.text, conn.user.jid, {mentions: users});
    await conn.relayMessage(m.chat, msg.message, {messageId: msg.key.id});
  } catch {
    


    const users = participants.map((u) => conn.decodeJid(u.id));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);
    const more = String.fromCharCode(8206);
    const masss = more.repeat(850);
    const htextos = `${text ? text : '*Escribe nuevamente el texto:D*'}`;
    if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
      var mediax = await quoted.download?.();
      conn.sendMessage(m.chat, {image: mediax, mentions: users, caption: htextos, mentions: users}, {quoted: m});
    } else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
      var mediax = await quoted.download?.();
      conn.sendMessage(m.chat, {video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos}, {quoted: m});
    } else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
      var mediax = await quoted.download?.();
      conn.sendMessage(m.chat, {audio: mediax, mentions: users, mimetype: 'audio/mpeg', fileName: `Hidetag.mp3`}, {quoted: m});
    } else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
      var mediax = await quoted.download?.();
      conn.sendMessage(m.chat, {sticker: mediax, mentions: users}, {quoted: m});
    } else {
      await conn.relayMessage(m.chat, {extendedTextMessage: {text: `${masss}\n${htextos}\n`, ...{contextInfo: {mentionedJid: users, externalAdReply: {thumbnail: imagen3, sourceUrl: md }}}}}, {});
    }
  }
};
handler.help = ['hidetag'];
handler.tags = ['grupo'];
handler.command = ['hidetag','tag'];
handler.group = true;
handler.admin = true;
export default handler;
*/
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

// 🔄 Función para normalizar JIDs
function normalizeJid(jid = '') {
  return jid.replace(/@.+/, '@s.whatsapp.net')
}

var handler = async (m, { conn, text, participants }) => {
  if (!m.quoted && !text)
    return conn.reply(m.chat, `❀ Debes enviar un texto para hacer un tag.`, m)

  try {
    // ✅ JIDs normalizados
    let users = participants.map(u => normalizeJid(u.id))

    let q = m.quoted ? m.quoted : m || m.text || m.sender
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender
    let msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted
            ? c.message[q.mtype]
            : { text: '' || c }
        },
        { quoted: null, userJid: conn.user.id }
      ),
      text || q.text,
      conn.user.jid,
      { mentions: users }
    )
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } catch {
    let users = participants.map(u => normalizeJid(u.id))
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''
    let isMedia = /image|video|sticker|audio/.test(mime)
    let more = String.fromCharCode(8206)
    let masss = more.repeat(850)
    let htextos = `${text ? text : '*¡¡¡Hola!!!*'}`

    if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, {
        image: mediax,
        mentions: users,
        caption: htextos
      }, { quoted: null })

    } else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, {
        video: mediax,
        mentions: users,
        mimetype: 'video/mp4',
        caption: htextos
      }, { quoted: null })

    } else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, {
        audio: mediax,
        mentions: users,
        mimetype: 'audio/mp4',
        fileName: `Hidetag.mp3`
      }, { quoted: null })

    } else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, {
        sticker: mediax,
        mentions: users
      }, { quoted: null })

    } else {
      await conn.relayMessage(m.chat, {
        extendedTextMessage: {
          text: `${masss}\n${htextos}\n`,
          contextInfo: {
            mentionedJid: users
          }
        }
      })
    }
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true

export default handler
