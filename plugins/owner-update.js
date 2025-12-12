import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

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
    // 🟩 DETECTAR ARCHIVOS JS MODIFICADOS
    // -----------------------------------
    const changedFiles = stdout
      .toString()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.match(/plugins\/.*\.js/))
      .map(line => line.match(/plugins\/.*\.js/)[0])
      .filter(f => fs.existsSync(f))
      .map(f => f.trim())

    const uniqueFiles = [...new Set(changedFiles)]

    // -----------------------------------
    // 🧪 VALIDAR SINTAXIS CON IMPORT()
    // -----------------------------------
    let okPlugins = []
    let errorPlugins = []

    for (let file of uniqueFiles) {
      try {
        const fullPath = path.resolve(file)
        const moduleUrl = pathToFileURL(fullPath).href + '?upd=' + Date.now()

        await import(moduleUrl)   // Verifica sintaxis

        okPlugins.push(file)
      } catch (e) {
        // ------------------------------
        // EXTRAER LÍNEA DEL ERROR
        // ------------------------------
        let line = null
        let stack = e.stack || ""

        // Detecta líneas tipo: file:///.../plugin.js:45:12
        let match = stack.match(/(\w:)?\/.*plugins\/.*\.js:(\d+):\d+/)

        if (match && match[2]) {
          line = match[2]  // número de línea
        }

        errorPlugins.push({
          file,
          error: e.message.split('\n')[0],
          line: line
        })
      }
    }

    // -----------------------------------
    // 📝 REPORTE FINAL
    // -----------------------------------
    let report = "🛠 *Reporte de actualización*\n\n"
    report += messager + "\n"

    if (uniqueFiles.length > 0) {
      report += `\n📂 *Plugins modificados:* ${uniqueFiles.length}\n`
      report += uniqueFiles.map(f => `- ${f}`).join('\n') + "\n"
    }

    // ✔ Plugins sin errores
    report += `\n✅ *Plugins correctos:* ${okPlugins.length}\n`
    if (okPlugins.length > 0) {
      report += okPlugins.map(p => `   • ${p}`).join('\n') + "\n"
    }

    // ❌ Plugins con errores
    if (errorPlugins.length > 0) {
      report += `\n⚠️ *Errores detectados en ${errorPlugins.length} plugin(s):*\n\n`
      report += errorPlugins
        .map(e =>
          `❌ *${e.file}*\n` +
          `   ➤ ${e.error}\n` +
          (e.line ? `   ➤ Línea del error: ${e.line}` : `   ➤ No se pudo detectar la línea`)
        )
        .join('\n\n')
    } else {
      report += `\n🎉 *No se encontraron errores en los plugins.*`
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
