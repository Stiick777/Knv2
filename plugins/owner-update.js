import { execSync } from 'child_process'
import fs from 'fs'

var handler = async (m, { conn, text }) => {
  m.react('🚀')

  try {
    const tmpExists = fs.existsSync('tmp')
    const status = execSync('git status --porcelain').toString().trim()
    if (status) execSync('git stash')

    const stdout = execSync('git pull --no-rebase' + (m.fromMe && text ? ' ' + text : ''))
    let messager = stdout.toString()

    if (status) execSync('git stash pop')
    if (!fs.existsSync('tmp') && tmpExists) fs.mkdirSync('tmp')

    // -----------------------------------
    // 🔍 EXTRAER SOLO ARCHIVOS JS REALES
    // -----------------------------------
    const changedFiles = stdout
      .toString()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.match(/\.js$/)) // solo archivos que terminan en .js
      .map(line => line.split('|')[0].trim()) // obtiene "plugins/file.js"
      .filter(file => fs.existsSync(file)) // evita archivos inexistentes
      .map(file => file.replace(/^./, m => m)) // limpio

    const uniqueFiles = [...new Set(changedFiles)]

    // -----------------------------------
    // 🧪 VALIDACIÓN DE SINTAXIS
    // -----------------------------------
    let okPlugins = []
    let errorPlugins = []

    for (let file of uniqueFiles) {
      try {
        delete require.cache[require.resolve('./' + file)]
        require('./' + file) // prueba de sintaxis
        okPlugins.push(file)
      } catch (e) {
        errorPlugins.push({
          file,
          error: e.message.split('\n')[0]
        })
      }
    }

    // -----------------------------------
    // 📝 CREAR REPORTE
    // -----------------------------------
    let report = "🛠 *Reporte de actualización*\n\n"
    report += messager + "\n"

    if (uniqueFiles.length > 0) {
      report += `\n📂 *Plugins modificados:* ${uniqueFiles.length}\n`
      report += uniqueFiles.map(f => `- ${f}`).join('\n') + "\n\n"
    }

    if (errorPlugins.length === 0) {
      report += `✅ *Se actualizaron correctamente ${okPlugins.length} plugins sin errores de sintaxis.*`
    } else {
      report += `⚠️ *Se detectaron errores de sintaxis en ${errorPlugins.length} plugin(s):*\n\n`
      report += errorPlugins.map(e => `❌ *${e.file}*\n   ➤ ${e.error}`).join('\n\n')
    }

    await conn.reply(m.chat, report, m)

  } catch (error) {
    console.error(error)
    let errorMessage = '⚠️ Ocurrió un error inesperado.\n'
    if (error.message) errorMessage += '⚠️ Mensaje de error: ' + error.message
    await conn.reply(m.chat, errorMessage, m)
  }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'up']
handler.owner = true

export default handler
