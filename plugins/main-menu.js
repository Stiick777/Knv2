import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
 'main': '𝑰𝑵𝑭𝑶×𝑩𝑶𝑻',
'buscador': '𝑩𝑼𝑺𝑪𝑨𝑫𝑶𝑹𝑬𝑺',
'fun': '𝑱𝑼𝑬𝑮𝑶𝑺',
'jadibot': '𝑺𝑬𝑹𝑩𝑶𝑻',
'rpg': '×𝑹×𝑷×𝑮×',
'sticker': '𝑺𝑻𝑰𝑪𝑲𝑬𝑹𝑺',
'anime': '𝑨𝑵𝑰𝑴𝑬𝑺',
'fix': '𝑭𝑰𝑿𝑴𝑬𝑵𝑺𝑨𝑱𝑬',
'grupo': '𝑮𝑹𝑼𝑷𝑶𝑺',
'descargas': '𝑫𝑬𝑺𝑪𝑨𝑹𝑮𝑨𝑺',
'tools': '𝑯𝑬𝑹𝑹𝑨𝑴𝑰𝑬𝑵𝑻𝑨𝑺',
'owner': '𝑪𝑹𝑬𝑨𝑫𝑶𝑹',
'ai': '×𝑨×𝑰×',
'transformador': '𝑪𝑶𝑵𝑽𝑬𝑹𝑻𝑰𝑫𝑶𝑹𝑬𝑺'
}

const defaultMenu = {
  before: `
◈ ━━━━━ *ᴋᴀɴʙᴏᴛ ┃ ᴼᶠᶜ* ━━━━━ ◈
 
👋🏻 𝑯𝒐𝒍𝒂! *%name*
👥 𝑼𝒔𝒖𝒂𝒓𝒊𝒐𝒔 : *%totalreg*
⚡ 𝑶𝒘𝒏𝒆𝒓 : Stiíven
🟢 𝑻𝒊𝒆𝒎𝒑𝒐 𝑨𝒄𝒕𝒊𝒗𝒐 : *%muptime*
%botofc

▢  FOLLOW ME
• https://whatsapp.com/channel/0029VakhAHc5fM5hgaQ8ed2N
────────────
    %readmore
╭━━━✦ ❘ ❬ ⒾⓝⒻⓄ Ⓤⓢⓤⓐⓡⓘⓞ ❭ ❘ ✦━━━╮  
┃ 🍁 *𝐔𝐬𝐮𝐚𝐫𝐢𝐨:* %name  
┃ 🍁 *𝐄𝐱𝐩:* %exp  
┃ 🍁 *𝐍𝐢𝐯𝐞𝐥:* %level  
┃ 🍁 *𝐑𝐚𝐧𝐠𝐨:* %role  
╰━━━✦ ❘ ❬ ✰ ❭ ❘ ✦━━━╯
%readmore
`.trimStart(),
header: '╭──〔 `%category` 〕─ ',
  body: '╞˚₊·͟͟͞͞➳❥ %cmd\n',
  footer: '╰──〔❨✧✧❩〕──╯\n',
  after: `> 🍁 ${dev}`,
}
  let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, cookies, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    /*let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)*/
    let _uptime = process.uptime() * 1000;
let _muptime = process.uptime() * 1000; // Usamos el mismo valor

let muptime = clockString(_muptime);
let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        estrellas: plugin.estrellas,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%isdiamond/g, menu.diamond ? '(ⓓ)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
botofc: (conn.user.jid == global.conn.user.jid ? '❤️ 𝑩𝒐𝒕 𝑶𝒇𝒇𝒊𝒄𝒊𝒂𝒍' : `🤍 𝑺𝒖𝒃𝑩𝒐𝒕 𝑫𝒆: Wa.me/${global.conn.user.jid.split`@`[0]}`), 
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
greeting, level, cookies, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

//const pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://files.catbox.moe/mt2cl8.jpg')

  let category = "video"
  const db = './src/database/db.json'
  const db_ = JSON.parse(fs.readFileSync(db))
  const random = Math.floor(Math.random() * db_.links[category].length)
  const rlink = db_.links[category][random]
  global.vid = rlink
  const response = await fetch(vid)
  const gif = await response.buffer()
  const img = imagen3


await m.react('🚀') 

await conn.sendFile(m.chat, imagen3, 'yaemori.jpg', text.trim(), fkontak, null)
/*conn.sendButton(m.chat, text.trim(), `▢ ʙʏ ꜱᴛɪɪᴠᴇɴ`, img, [
      ['⏍ Info', `${_p}status`],
      ['⌬ Grupos', `${_p}ofcc`]
    ], m, )
*/
    
  } catch (e) {
    conn.reply(m.chat, '🔵 Lo sentimos, el menú tiene un error', m,  )
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'menuall', 'allmenú', 'allmenu', 'mkan'] 
handler.group = true;


export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

/*function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}*/
function clockString(ms) {
  if (isNaN(ms)) return '--';

  let d = Math.floor(ms / 86400000); // días
  let h = Math.floor(ms / 3600000) % 24;
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;

  let parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
}

  var ase = new Date();
  var hour = ase.getHours();
switch(hour){
  case 0: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 🌙'; break;
  case 1: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 💤'; break;
  case 2: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 🦉'; break;
  case 3: hour = 'Bᴜᴇɴᴏs Dɪᴀs ✨'; break;
  case 4: hour = 'Bᴜᴇɴᴏs Dɪᴀs 💫'; break;
  case 5: hour = 'Bᴜᴇɴᴏs Dɪᴀs 🌅'; break;
  case 6: hour = 'Bᴜᴇɴᴏs Dɪᴀs 🌄'; break;
  case 7: hour = 'Bᴜᴇɴᴏs Dɪᴀs 🌅'; break;
  case 8: hour = 'Bᴜᴇɴᴏs Dɪᴀs 💫'; break;
  case 9: hour = 'Bᴜᴇɴᴏs Dɪᴀs ✨'; break;
  case 10: hour = 'Bᴜᴇɴᴏs Dɪᴀs 🌞'; break;
  case 11: hour = 'Bᴜᴇɴᴏs Dɪᴀs 🌨'; break;
  case 12: hour = 'Bᴜᴇɴᴏs Dɪᴀs ❄'; break;
  case 13: hour = 'Bᴜᴇɴᴏs Dɪᴀs 🌤'; break;
  case 14: hour = 'Bᴜᴇɴᴀs Tᴀʀᴅᴇs 🌇'; break;
  case 15: hour = 'Bᴜᴇɴᴀs Tᴀʀᴅᴇs 🥀'; break;
  case 16: hour = 'Bᴜᴇɴᴀs Tᴀʀᴅᴇs 🌹'; break;
  case 17: hour = 'Bᴜᴇɴᴀs Tᴀʀᴅᴇs 🌆'; break;
  case 18: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 🌙'; break;
  case 19: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 🌃'; break;
  case 20: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 🌌'; break;
  case 21: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 🌃'; break;
  case 22: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 🌙'; break;
  case 23: hour = 'Bᴜᴇɴᴀs Nᴏᴄʜᴇs 🌃'; break;
}
  var greeting = hour;
