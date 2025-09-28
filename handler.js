import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
clearTimeout(this)
resolve()
}, ms))

export async function handler(chatUpdate) {
this.msgqueque = this.msgqueque || []
this.uptime = this.uptime || Date.now()
if (!chatUpdate)
return
this.pushMessage(chatUpdate.messages).catch(console.error)
let m = chatUpdate.messages[chatUpdate.messages.length - 1]
if (!m)
return;
if (global.db.data == null)
await global.loadDatabase()       
try {
m = smsg(this, m) || m
if (!m)
return
m.exp = 0
m.coin = false
try {
let user = global.db.data.users[m.sender]
if (typeof user !== 'object')  
global.db.data.users[m.sender] = {}
if (user) {
if (!isNumber(user.exp)) user.exp = 10000
if (!('premium' in user)) user.premium = false
if (!('muto' in user)) user.muto = false
if (!isNumber(user.joincount)) user.joincount = 1
if (!('registered' in user)) user.registered = false
    
if (!user.registered) {
if (!('name' in user)) user.name = m.name
if (!isNumber(user.regTime)) user.regTime = -1
}

if (!isNumber(user.afk)) user.afk = -1
if (!('role' in user)) user.role = 'Novato'
if (!isNumber(user.bank)) user.bank = 0
if (!isNumber(user.iron)) user.iron = 0
if (!isNumber(user.estrellas)) user.estrellas = 10000

if (!isNumber(user.gold)) user.gold = 0
if (!isNumber(user.lastcoins)) user.lastcoins = 0    
if (!isNumber(user.lastclaim)) user.lastclaim = 0
if (!isNumber(user.lastcode)) user.lastcode = 0
if (!isNumber(user.lastcofre)) user.lastcofre = 0
if (!isNumber(user.lastcodereg)) user.lastcodereg = 0

if (!isNumber(user.crime)) user.crime = 0
if (!isNumber(user.lastmining)) user.lastmining = 0

if (!isNumber(user.level)) user.level = 1
if (!isNumber(user.warn)) user.warn = 0
if (!user.premium) user.premiumTime = 0
} else
global.db.data.users[m.sender] = {
afk: -1,
afkReason: '',
name: m.name,
bank: 0,
banned: false,
BannedReason: '',
Banneduser: false,
iron: 0,
estrellas: 10000,
joincount: 1,
gold: 0,
lastcoins: 0,
lastclaim: 0,
lastcode: 0,
lastcofre: 0,
lastrob: 0,
level: 1,
role: 'Novato',
exp: 10000,
registered: false,
regTime: -1,
rendang: 0, 
}
    
let chat = global.db.data.chats[m.chat]
if (typeof chat !== 'object')
global.db.data.chats[m.chat] = {}
if (chat) {
if (!('isBanned' in chat)) chat.isBanned = false         
if (!('welcome' in chat)) chat.welcome = true 
if (!('autoresponder' in chat)) chat.autoresponder = false          
if (!('detect' in chat)) chat.detect = true               
if (!('sWelcome' in chat)) chat.sWelcome = ''          
if (!('sBye' in chat)) chat.sBye = ''                    
if (!('sPromote' in chat)) chat.sPromote = ''             
if (!('sDemote' in chat)) chat.sDemote = ''
if (!('sAutoresponder' in chat)) chat.sAutoresponder = '' 
if (!('sCondition' in chat)) chat.sCondition = JSON.stringify([{ grupo: { usuario: [], condicion: [], admin: '' }, prefijos: []}])
if (!('delete' in chat)) chat.delete = false                   
if (!('nsfw' in chat)) chat.nsfw = false
if (!('autoAceptar' in chat)) chat.autoAceptar = false                   
if (!('autosticker' in chat)) chat.autosticker = false      
if (!('audios' in chat)) chat.audios = true
if (!('antiBot' in chat)) chat.antiBot = false 
if (!('antiBot2' in chat)) chat.antiBot2 = false               
if (!('antiver' in chat)) chat.antiver = false 
if (!('antiPorn' in chat)) chat.antiPorn = false     
if (!('antiLink' in chat)) chat.antiLink = true
if (!('antiLink2' in chat)) chat.antiLink2 = false
if (!('antiTiktok' in chat)) chat.antiTiktok = false
if (!('antiYoutube' in chat)) chat.antiYoutube = false
if (!('antiTelegram' in chat)) chat.antiTelegram = false
if (!('antiFacebook' in chat)) chat.antiFacebook = false
if (!('antiInstagram' in chat)) chat.antiInstagram = false
if (!('antiTwitter' in chat)) chat.antiTwitter = false
if (!('antiDiscord' in chat)) chat.antiDiscord = false
if (!('antiThreads' in chat)) chat.antiThreads = false
if (!('antiTwitch' in chat)) chat.antiTwitch = false
if (!('antifake' in chat)) chat.antifake = false
if (!('reaction' in chat)) chat.reaction = false  
if (!('viewonce' in chat)) chat.viewonce = false       
if (!('modoadmin' in chat)) chat.modoadmin = false    
if (!('antitoxic' in chat)) chat.antitoxic = false
if (!('simi' in chat)) chat.simi = false
if (!('antiTraba' in chat)) chat.antiTraba = false
if (!('autolevelup' in chat))  chat.autolevelup = false
if (!isNumber(chat.expired)) chat.expired = 0
} else
global.db.data.chats[m.chat] = {
isBanned: false,
welcome: true,
detect: true,
sWelcome: '',
sBye: '',
sPromote: '',
sDemote: '', 
sAutoresponder: '',
sCondition: JSON.stringify([{ grupo: { usuario: [], condicion: [], admin: '' }, prefijos: []}]), 
delete: false,
autoresponder: false,
autoAceptar: false,
nsfw: false,
autosticker: false,
audios: true,
antiBot: false,
antiBot2: false,
antiver: false,
antiPorn: false,
antiLink: true,
antiLink2: false,
antiTiktok: false,
antiYoutube: false,
antiTelegram: false,
antiFacebook: false,
antiInstagram: false,
antiTwitter: false,
antiDiscord: false,
antiThreads: false,
antiTwitch: false,
antifake: false,
reaction: false,
viewonce: false,
modoadmin: false,
antitoxic: false, 
simi: false,
antiTraba: false,
autolevelup: false,
expired: 0,
}
var settings = global.db.data.settings[this.user.jid]
if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
if (settings) {
if (!('self' in settings)) settings.self = false
if (!('autoread' in settings)) settings.autoread = false
if (!('autoread2' in settings)) settings.autoread2 = false
if (!('restrict' in settings)) settings.restrict = true
if (!('antiPrivate' in settings)) settings.antiPrivate = false
if (!('antiCall' in settings)) settings.antiCall = true
if (!('antiSpam' in settings)) settings.antiSpam = false
if (!('modoia' in settings)) settings.modoia = false
if (!('jadibotmd' in settings)) settings.jadibotmd = false  
if (!('autobio' in settings)) settings.autobio = false
} else global.db.data.settings[this.user.jid] = {
self: false,
autoread: false,
autoread2: false,
restrict: true,
antiPrivate: false,
antiCall: true,
antiSpam: false,
modoia: false, 
jadibotmd: true,
autobio: false,
}} catch (e) {
console.error(e)
}

let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
const isOwner = isROwner || m.fromMe
const isMods = isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender) || _user.premium == true

//if (m.isBaileys) return
if (opts['nyimak'])  return
if (!isROwner && opts['self']) return
if (opts['swonly'] && m.chat !== 'status@broadcast')  return
if (typeof m.text !== 'string')
m.text = ''

if (opts['queque'] && m.text && !(isMods || isPrems)) {
let queque = this.msgqueque, time = 1000 * 5
const previousID = queque[queque.length - 1]
queque.push(m.id || m.key.id)
setInterval(async function () {
if (queque.indexOf(previousID) === -1) clearInterval(this)
await delay(time)
}, time)
}

m.exp += Math.ceil(Math.random() * 10)

let usedPrefix

const groupMetadata = m.isGroup ? { ...(conn.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(_ => null) || {}), ...(((conn.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(_ => null) || {}).participants) && { participants: ((conn.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(_ => null) || {}).participants || []).map(p => ({ ...p, id: p.jid, jid: p.jid, lid: p.lid })) }) } : {}
const participants = ((m.isGroup ? groupMetadata.participants : []) || []).map(participant => ({ id: participant.jid, jid: participant.jid, lid: participant.lid, admin: participant.admin }))
const userGroup = (m.isGroup ? participants.find((u) => conn.decodeJid(u.jid) === m.sender) : {}) || {}
const botGroup = (m.isGroup ? participants.find((u) => conn.decodeJid(u.jid) == this.user.jid) : {}) || {}
const isRAdmin = userGroup?.admin == "superadmin" || false
const isAdmin = isRAdmin || userGroup?.admin == "admin" || false
const isBotAdmin = botGroup?.admin || false

const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin)
continue
if (plugin.disabled)
continue
const __filename = join(___dirname, name)
if (typeof plugin.all === 'function') {
try {
await plugin.all.call(this, m, {
chatUpdate,
__dirname: ___dirname,
__filename
})
} catch (e) {
console.error(e)
}}
if (!opts['restrict'])
if (plugin.tags && plugin.tags.includes('admin')) {
continue
}
const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
let match = (_prefix instanceof RegExp ? 
[[_prefix.exec(m.text), _prefix]] :
Array.isArray(_prefix) ?
_prefix.map(p => {
let re = p instanceof RegExp ?
p :
new RegExp(str2Regex(p))
return [re.exec(m.text), re]
}) :
typeof _prefix === 'string' ?
[[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
[[[], new RegExp]]
).find(p => p[1])
if (typeof plugin.before === 'function') {
if (await plugin.before.call(this, m, {
match,
conn: this,
participants,
groupMetadata,
user,
bot,
isROwner,
isOwner,
isRAdmin,
isAdmin,
isBotAdmin,
isPrems,
chatUpdate,
__dirname: ___dirname,
__filename
}))
continue
}
if (typeof plugin !== 'function')
continue
if ((usedPrefix = (match[0] || '')[0])) {
let noPrefix = m.text.replace(usedPrefix, '')
let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
args = args || []
let _args = noPrefix.trim().split` `.slice(1)
let text = _args.join` `
command = (command || '').toLowerCase()
let fail = plugin.fail || global.dfail
let isAccept = plugin.command instanceof RegExp ? 
plugin.command.test(command) :
Array.isArray(plugin.command) ?
plugin.command.some(cmd => cmd instanceof RegExp ? 
cmd.test(command) :
cmd === command) :
typeof plugin.command === 'string' ? 
plugin.command === command :
false

global.comando = command

if ((m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20))) return

if (!isAccept) {
continue
}
m.plugin = name
if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
if (!['mods-unbanchat.js'].includes(name) && chat && chat.isBanned && !isROwner) return
if (name != 'mods-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'gc-delete.js' && chat?.isBanned && !isROwner) return
if (m.text && user.banned && !isROwner) {
m.reply(`🚫 Está baneado(a), no puede usar los comandos de este bot!\n\n${user.bannedReason ? `\n💌 *Motivo:* 
${user.bannedReason}` : '💌 *Motivo:* Spam'}\n\n⚠️ *Si cree que fue por error y tiene evidencia que respalde que este mensaje es un error o fue sin querer, puede exponer su caso en:*\n\n🤍 wa.me/526645011701\n\ny pedir que lo desbaneen`)
return
}

if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let setting = global.db.data.settings[this.user.jid]
if (name != 'mods-unbanchat.js' && chat?.isBanned)
return 
if (name != 'mods-unbanuser.js' && user?.banned)
return
}}

let hl = _prefix 
let adminMode = global.db.data.chats[m.chat].modoadmin
let mini = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl ||  m.text.slice(0, 1) == hl || plugins.command}`
if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return   
if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { 
fail('owner', m, this)
continue
}
if (plugin.rowner && !isROwner) { 
fail('rowner', m, this)
continue
}
if (plugin.owner && !isOwner) { 
fail('owner', m, this)
continue
}
if (plugin.mods && !isMods) { 
fail('mods', m, this)
continue
}
if (plugin.premium && !isPrems) { 
fail('premium', m, this)
continue
}
if (plugin.group && !m.isGroup) { 
fail('group', m, this)
continue
} else if (plugin.botAdmin && !isBotAdmin) { 
fail('botAdmin', m, this)
continue
} else if (plugin.admin && !isAdmin) { 
fail('admin', m, this)
continue
}
if (plugin.private && m.isGroup) {
fail('private', m, this)
continue
}
if (plugin.register == true && _user.registered == false) { 
fail('unreg', m, this)
continue
}
m.isCommand = true
let xp = 'exp' in plugin ? parseInt(plugin.exp) : 10
m.exp += xp
if (!isPrems && plugin.coin && global.db.data.users[m.sender].coin < plugin.coin * 1) {
conn.reply(m.chat, `❮✦❯ Se agotaron tus ${moneda}`, m)
continue
}
if (plugin.level > _user.level) {
conn.reply(m.chat, `❮✦❯ Se requiere el nivel: *${plugin.level}*\n\n• Tu nivel actual es: *${_user.level}*\n\n• Usa este comando para subir de nivel:\n*${usedPrefix}levelup*`, m)
continue
}
let extra = {
match,
usedPrefix,
noPrefix,
_args,
args,
command,
text,
conn: this,
participants,
groupMetadata,
user,
bot,
isROwner,
isOwner,
isRAdmin,
isAdmin,
isBotAdmin,
isPrems,
chatUpdate,
__dirname: ___dirname,
__filename
}
try {
await plugin.call(this, m, extra)
if (!isPrems)
m.coin = m.coin || plugin.coin || false
} catch (e) {
m.error = e
console.error(e)
if (e) {
let text = format(e)
for (let key of Object.values(global.APIKeys))
text = text.replace(new RegExp(key, 'g'), 'Administrador')
m.reply(text)
}
} finally {
if (typeof plugin.after === 'function') {
try {
await plugin.after.call(this, m, extra)
} catch (e) {
console.error(e)
}}
if (m.coin)
conn.reply(m.chat, `❮✦❯ Utilizaste ${+m.coin} ${moneda}`, m)
}
break
}}
} catch (e) {
console.error(e)
} finally {
if (opts['queque'] && m.text) {
const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
if (quequeIndex !== -1)
this.msgqueque.splice(quequeIndex, 1)
}
let user, stats = global.db.data.stats
if (m) { let utente = global.db.data.users[m.sender]
if (utente.muto == true) {
let bang = m.key.id
let cancellazzione = m.key.participant
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione }})
}
if (m.sender && (user = global.db.data.users[m.sender])) {
user.exp += m.exp
user.coin -= m.coin * 1
}

let stat
if (m.plugin) {
let now = +new Date
if (m.plugin in stats) {
stat = stats[m.plugin]
if (!isNumber(stat.total))
stat.total = 1
if (!isNumber(stat.success))
stat.success = m.error != null ? 0 : 1
if (!isNumber(stat.last))
stat.last = now
if (!isNumber(stat.lastSuccess))
stat.lastSuccess = m.error != null ? 0 : now
} else
stat = stats[m.plugin] = {
total: 1,
success: m.error != null ? 0 : 1,
last: now,
lastSuccess: m.error != null ? 0 : now
}
stat.total += 1
stat.last = now
if (m.error == null) {
stat.success += 1
stat.lastSuccess = now
}}}

try {
if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
} catch (e) { 
console.log(m, m.quoted, e)}
let settingsREAD = global.db.data.settings[this.user.jid] || {}  
if (opts['autoread']) await this.readMessages([m.key])

if (db.data.chats[m.chat].reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|yuki|a|s)/gi)) {
let emot = pickRandom(["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"])
if (!m.fromMe) return this.sendMessage(m.chat, { react: { text: emot, key: m.key }})
}
function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]}
}}

global.dfail = (type, m, usedPrefix, command, conn) => {

let edadaleatoria = ['10', '28', '20', '40', '18', '21', '15', '11', '9', '17', '25'].getRandom()
let user2 = m.pushName || 'Anónimo'
let verifyaleatorio = ['registrar', 'reg', 'verificar', 'verify', 'register'].getRandom()

const msg = {
rowner: '「⚡」 *Esta función solo puede ser usada por mi creador*\n\n> Stiiven.', 
owner: '「🔰」 *Esta función solo puede ser usada por mi desarrollador.', 
mods: '「🌥️」 *Esta función solo puede ser usada por mis desarrolladores.*', 
premium: '「💡」 *Esta función solo es para usuarios Premium.', 
group: '「🔥」 *Esta funcion solo puede ser ejecutada en el grupo ofical del bot.*\nhttps://chat.whatsapp.com/HDoyT3SlpYzBlpawlWNpKw', 
private: '「💝」 *Esta función solo puede ser usada en chat privado.*', 
admin: '「⚠️」 *Este comando solo puede ser usado por admins.*', 
botAdmin: '「✴️」 *Para usar esta función debo ser admin.*', 
unreg: '「🔷」 *¡Hey! no estas registrado, registrese para usar esta función*\n\n*/reg nombre.edad*\n\n*_❕ Ejemplo_* : */reg Kan.23*',
restrict: '「❌」 *Esta característica esta desactivada.*'
}[type];
if (msg) return m.reply(msg).then(_ => m.react('✖️'))}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
unwatchFile(file)
console.log(chalk.magenta("Se actualizo 'handler.js'"))

if (global.conns && global.conns.length > 0 ) {
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
for (const userr of users) {
userr.subreloadHandler(false)
}}})
