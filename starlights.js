process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import {createRequire} from 'module'
import path, {join} from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws'
import {readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch} from 'fs'
import yargs from 'yargs'
import {spawn} from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import {Boom} from '@hapi/boom'
import {makeWASocket, protoType, serialize} from './lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import store from './lib/store.js'
const {proto} = (await import('@whiskeysockets/baileys')).default
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, Browsers, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC } = await import('@whiskeysockets/baileys')
import readline from 'readline'
import NodeCache from 'node-cache'
const {CONNECTING} = ws
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(new JSONFile(`src/database/database.json`))

global.DATABASE = global.db 
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this)
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
    }
  }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = chain(global.db.data)
}
loadDatabase()

global.authFile = `sessions`
const { state, saveCreds } = await useMultiFileAuthState(global.authFile)

const { version } = await fetchLatestBaileysVersion()

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

console.info = () => {} 
const logger = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
}).child({ class: "client" })
logger.level = "fatal"

  const connectionOptions = {
    version: [2, 3000, 1015901307],
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: Browsers.ubuntu("Chrome"),
    markOnlineOnclientect: false,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    retryRequestDelayMs: 10,
    transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
    defaultQueryTimeoutMs: undefined,
    maxMsgRetryCount: 15,
    appStateMacVerification: {
      patch: false,
      snapshot: false,
    },
    getMessage: async (key) => {
      const jid = jidNormalizedUser(key.remoteJid)
      const msg = await store.loadMessage(jid, key.id)

      return msg?.message || ""
    },
  }

global.conn = makeWASocket(connectionOptions)

if (!conn.authState.creds.registered) {
  const phoneNumber = await question(chalk.blue('Ingresa el número de WhatsApp en el cual estará la Bot\n'))
  
  if (conn.requestPairingCode) {
    let code = await conn.requestPairingCode(phoneNumber)
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(chalk.cyan(`Su código es:`, code))
  } else {
  }
}

conn.isInit = false
conn.well = false

if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', 'serbot'], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
    }, 30 * 1000);
  }
}
/*
function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))))
  return filename.map((file) => {
    const stats = statSync(file)
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file)
    return false
  })
}

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  const a = await clearTmp()
}, 180000)
*/
function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  let deletedFiles = 0;

  tmp.forEach((dirname) => {
    readdirSync(dirname).forEach((file) => {
      const filePath = join(dirname, file);
      const stats = statSync(filePath);
      if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) {
        unlinkSync(filePath);
        deletedFiles++;
      }
    });
  });

  if (deletedFiles > 0) {
    console.log(chalk.bold.cyanBright(`\n╭» ❍ MULTIMEDIA ❍\n│→ ${deletedFiles} ARCHIVOS DE TMP ELIMINADOS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`));
  }
}

function purgeSession() {
  let deletedSessions = 0;
  const directorio = readdirSync(`./${global.authFile}`);
  const filesFolderPreKeys = directorio.filter(file => file.startsWith('pre-key-'));

  filesFolderPreKeys.forEach(files => {
    unlinkSync(`./${global.authFile}/${files}`);
    deletedSessions++;
  });

  if (deletedSessions > 0) {
    console.log(chalk.bold.cyanBright(`\n╭» ❍ ${global.authFile} ❍\n│→ ${deletedSessions} SESIONES NO ESENCIALES ELIMINADAS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`));
  }
}

function purgeSessionSB() {
  try {
    const listaDirectorios = readdirSync(`./${global.jadi}/`);
    let SBprekey = [];

    listaDirectorios.forEach(directorio => {
      if (statSync(`./${global.jadi}/${directorio}`).isDirectory()) {
        const DSBPreKeys = readdirSync(`./${global.jadi}/${directorio}`).filter(fileInDir => {
          return fileInDir.startsWith('pre-key-');
        });

        SBprekey = [...SBprekey, ...DSBPreKeys];

        DSBPreKeys.forEach(fileInDir => {
          if (fileInDir !== 'creds.json') {
            unlinkSync(`./${global.jadi}/${directorio}/${fileInDir}`);
          }
        });
      }
    });

    if (SBprekey.length === 0) {
      console.log(chalk.bold.green(`\n╭» ❍ ${global.jadi} ❍\n│→ NADA POR ELIMINAR\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`));
    } else {
      console.log(chalk.bold.cyanBright(`\n╭» ❍ ${global.jadi} ❍\n│→ ARCHIVOS NO ESENCIALES ELIMINADOS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`));
    }
  } catch (err) {
    console.log(chalk.bold.red(`\n╭» ❍ ${global.jadi} ❍\n│→ ERROR AL ELIMINAR\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ✘\n` + err));
  }
}

function purgeOldFiles() {
  const directories = [`./${global.authFile}/`, `./${global.jadi}/`];
  let deletedFiles = 0;

  directories.forEach(dir => {
    try {
      const files = readdirSync(dir);
      files.forEach(file => {
        if (file !== 'creds.json') {
          const filePath = join(dir, file);
          unlinkSync(filePath);
          deletedFiles++;
          console.log(chalk.bold.green(`\n╭» ❍ ARCHIVO ❍\n│→ ${file} BORRADO CON ÉXITO\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`));
        }
      });
    } catch (err) {
      console.log(chalk.bold.red(`\n╭» ❍ ERROR ❍\n│→ NO SE LOGRÓ ACCEDER A ${dir}\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ✘\n` + err));
    }
  });

  if (deletedFiles > 0) {
    console.log(chalk.bold.cyanBright(`\n╭» ❍ ARCHIVOS ❍\n│→ ${deletedFiles} ARCHIVOS RESIDUALES ELIMINADOS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`));
  }
}

// Ejecutar clearTmp() cada 3 minutos
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  clearTmp();
}, 1000 * 60 * 3); // 3 minutos

// Ejecutar purgeSession() cada 10 minutos
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  purgeSession();
}, 1000 * 60 * 5); // 10 minutos

// Ejecutar purgeSessionSB() cada 10 minutos
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  purgeSessionSB();
}, 1000 * 60 * 5); // 10 minutos

// Ejecutar purgeOldFiles() cada 10 minutos
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  purgeOldFiles();
}, 1000 * 60 * 5); // 10 minutos

async function connectionUpdate(update) {
  const {connection, lastDisconnect, isNewLogin} = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error)
    global.timestamp.connect = new Date;
  }
  if (global.db.data == null) loadDatabase();
  if (connection == 'open') {
    console.log(chalk.yellow('Conectado correctamente.'))
  }
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
if (reason == 405) {
await fs.unlinkSync("./sessions/" + "creds.json")
console.log(chalk.bold.redBright(`Conexión replazada, Por favor espere un momento me voy a reiniciar...\nSi aparecen error vuelve a iniciar con : npm start`)) 
process.send('reset')}
if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
        conn.logger.error(`Sesión incorrecta, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`)
    } else if (reason === DisconnectReason.connectionClosed) {
        conn.logger.warn(`Conexión cerrada, reconectando...`)
        await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionLost) {
        conn.logger.warn(`Conexión perdida con el servidor, reconectando...`)
        await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionReplaced) {
        conn.logger.error(`Conexión reemplazada, se ha abierto otra nueva sesión. Por favor, cierra la sesión actual primero.`)
    } else if (reason === DisconnectReason.loggedOut) {
        conn.logger.error(`Conexion cerrada, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`)
    } else if (reason === DisconnectReason.restartRequired) {
        conn.logger.info(`Reinicio necesario, reinicie el servidor si presenta algún problema.`)
        await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.timedOut) {
        conn.logger.warn(`Tiempo de conexión agotado, reconectando...`)
        await global.reloadHandler(true).catch(console.error)
    } else {
        conn.logger.warn(`Razón de desconexión desconocida. ${reason || ''}: ${connection || ''}`)
        await global.reloadHandler(true).catch(console.error)
    }
}
}

process.on('uncaughtException', console.error)

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e);
  }
  if (restatConn) {
    const oldChats = global.conn.chats
    try {
      global.conn.ws.close()
    } catch { }
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, {chats: oldChats})
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.handler = handler.handler.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn, true)

  const currentDateTime = new Date()
  const messageDateTime = new Date(conn.ev)
  if (currentDateTime >= messageDateTime) {
    const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
  } else {
    const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
  }

  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e)
      delete global.plugins[filename]
    }
  }
}
filesInit().catch(console.error)

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin - '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`new plugin - '${filename}'`);
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
      }
    }
  }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()
