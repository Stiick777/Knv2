
const handler = async (m, {conn, usedPrefix, command, args, isOwner, isAdmin, isROwner}) => {

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

const miniopcion = `🎈 *OPCIONES PARA GRUPOS*

${usedPrefix + command} welcome
${usedPrefix + command} detect
${usedPrefix + command} antidelete
${usedPrefix + command} antilink
${usedPrefix + command} antilink2
${usedPrefix + command} autosticker
${usedPrefix + command} reaction
${usedPrefix + command} modoadmin
${usedPrefix + command} antifake

⚡ *OPCIONES PARA MI PROPIETARIO*

${usedPrefix + command} serbot
${usedPrefix + command} restrict
${usedPrefix + command} autoread
${usedPrefix + command} antillamar
${usedPrefix + command} antispam
${usedPrefix + command} pconly
${usedPrefix + command} gconly
${usedPrefix + command} antiprivado`

// Helper que actualiza valores y responde si hubo cambio o no
function toggleSetting(obj, prop, newValue, type, isAll, m) {
  let before = obj[prop]
  obj[prop] = newValue
  if (before === newValue) {
    conn.reply(m.chat, `⚠️ La función *${type}* ya estaba ${newValue ? 'activada' : 'desactivada'}.`, m)
  } else {
    conn.reply(m.chat, `💡 La función *${type}* se ha ${newValue ? 'activado' : 'desactivado'} en este ${isAll ? 'Bot' : 'Chat'}.`, m)
  }
}

const isEnable = /true|enable|(turn)?on|1/i.test(command);
const chat = global.db.data.chats[m.chat];
const user = global.db.data.users[m.sender];
const bot = global.db.data.settings[conn.user.jid] || {};
const type = (args[0] || '').toLowerCase();
let isAll = false; const isUser = false;

switch (type) {
case 'welcome': case 'bienvenida':
if (!m.isGroup) {
  if (!isOwner) { global.dfail('group', m, conn); throw false }
} else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
toggleSetting(chat, 'welcome', isEnable, type, isAll, m)
break          

case 'detect': case 'avisos':
if (!m.isGroup) {
  if (!isOwner) { global.dfail('group', m, conn); throw false }
} else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
toggleSetting(chat, 'detect', isEnable, type, isAll, m)
break

case 'antilink': case 'antienlace':
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'antiLink', isEnable, type, isAll, m)
break

case 'antilink2': case 'antienlace2':
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'antiLink2', isEnable, type, isAll, m)
break

case 'autosticker':
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'autosticker', isEnable, type, isAll, m)         
break

case 'reaction': case 'reaccion': case 'emojis': case 'antiemojis': case 'reacciones': case 'reaciones':
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'reaction', isEnable, type, isAll, m)         
break

case 'antitoxic': case 'antitoxicos': case 'antimalos':
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'antitoxic', isEnable, type, isAll, m)
break

case 'audios':
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'audios', isEnable, type, isAll, m)         
break

case 'antiver': case 'modover': case 'modoobservar': case 'modobservar': case 'antiviewonce':
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'antiver', isEnable, type, isAll, m) 
break

case 'antiinternacional': case 'antinternacional': case 'antinternational': case 'antifake': case 'antifalsos': case 'antivirtuales': case 'antiextranjeros':                
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'antifake', isEnable, type, isAll, m)         
break

case 'jadibot': case 'modojadibot': case 'serbot': case 'modoserbot': 
isAll = true
if (!isROwner) { global.dfail('rowner', m, conn); throw false }
toggleSetting(bot, 'jadibotmd', isEnable, type, isAll, m)
break 

case 'restrict': case 'restringir':
isAll = true
if (!isOwner) { global.dfail('owner', m, conn); throw false }
toggleSetting(bot, 'restrict', isEnable, type, isAll, m)
break

case 'autoread': case 'autovisto':
isAll = true
if (!isROwner) { global.dfail('rowner', m, conn); throw false }
toggleSetting(bot, 'autoread2', isEnable, type, isAll, m)
global.opts['autoread'] = isEnable  
break

case 'anticall': case 'antillamar':
isAll = true
if (!isROwner) { global.dfail('rowner', m, conn); throw false }
toggleSetting(bot, 'antiCall', isEnable, type, isAll, m)
break

case 'antispam':
isAll = true
if (!isOwner) { global.dfail('owner', m, conn); throw false }
toggleSetting(bot, 'antiSpam', isEnable, type, isAll, m)
break

case 'modoadmin': case 'soloadmin': case 'modeadmin':
if (m.isGroup) {
  if (!(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
}
toggleSetting(chat, 'modoadmin', isEnable, type, isAll, m)         
break  

case 'antiprivado': case 'antiprivate': case 'anti-pv': case 'antipm':
  isAll = true
  if (!isROwner) { global.dfail('rowner', m, conn); throw false }
  toggleSetting(global.db.data.settings[conn.user.jid], 'antiPrivate', isEnable, type, isAll, m)
  break

case 'pconly': case 'privateonly': case 'soloprivados':
isAll = true
if (!isROwner) { global.dfail('rowner', m, conn); throw false }
toggleSetting(global.opts, 'pconly', isEnable, type, isAll, m)
break

case 'gconly': case 'grouponly': case 'sologrupos':
isAll = true
if (!isROwner) { global.dfail('rowner', m, conn); throw false }
toggleSetting(global.opts, 'gconly', isEnable, type, isAll, m)
break

default:
if (!/[01]/.test(command)) return await conn.reply(m.chat, miniopcion, m,)
throw false;
}

}
handler.help = ['en', 'dis'].map((v) => v + 'able <option>');
handler.tags = ['grupo'];
handler.command = ['enable', 'disable', 'on', 'off'];
export default handler;
