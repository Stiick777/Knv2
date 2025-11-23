/*import { execSync } from 'child_process'
import fs from 'fs'

var handler = async (m, { conn, text }) => {
  m.react('🚀')
  try {
    // Verificar si la carpeta tmp existe antes de actualizar
    const tmpExists = fs.existsSync('tmp')

    // Guardar cambios locales solo si hay modificaciones
    const status = execSync('git status --porcelain').toString().trim()
    if (status) {
      execSync('git stash')
    }

    // Actualizar el repositorio sin rebase para evitar eliminar archivos locales
    const stdout = execSync('git pull --no-rebase' + (m.fromMe && text ? ' ' + text : ''))
    let messager = stdout.toString()

    // Restaurar cambios locales si se hizo stash
    if (status) {
      execSync('git stash pop')
    }

    // Restaurar la carpeta tmp si fue eliminada
    if (!fs.existsSync('tmp') && tmpExists) {
      fs.mkdirSync('tmp')
    }

    conn.reply(m.chat, messager, m)

  } catch (error) {
    console.error(error)
    let errorMessage = '⚠️ Ocurrió un error inesperado.\n'
    if (error.message) {
      errorMessage += '⚠️ Mensaje de error: ' + error.message
    }
    await conn.reply(m.chat, errorMessage, m)
  }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'up']
handler.owner = true

export default handler
*/
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import url from 'url'

var handler = async (m, { conn, text }) => {
  m.react('🚀')

  try {
    const tmpExists = fs.existsSync('tmp')

    // Guardar cambios si los hay
    const status = execSync('git status --porcelain').toString().trim()
    if (status) execSync('git stash')

    // Ejecutar el pull
    const stdout = execSync('git pull --no-rebase' + (m.fromMe && text ? ' ' + text : ''))
    let messager = stdout.toString()

    // Restaurar cambios locales
    if (status) execSync('git stash pop')

    // Restaurar carpeta tmp si se removió
    if (!fs.existsSync('tmp') && tmpExists) fs.mkdirSync('tmp')

    // ------------------------------
    //   🔍 DETECTAR ARCHIVOS CAMBIADOS
    // ------------------------------
    const changedFiles = stdout
      .toString()
      .split('\n')
      .filter(line => line.includes('.js'))
      .map(line => line.replace(/^.*\s+/, '').trim())

    // Evitar paths duplicados
    const uniqueFiles = [...new Set(changedFiles)]

    // ------------------------------
    //   🧪 VALIDAR SINTAXIS DE PLUGINS
    // ------------------------------
    let okPlugins = []
    let errorPlugins = []

    for (let file of uniqueFiles) {
      if (!fs.existsSync(file)) continue

      try {
        delete require.cache[require.resolve(file)]
        require(file) // prueba de sintaxis
        okPlugins.push(file)
      } catch (e) {
        errorPlugins.push({
          file,
          error: e.message.split('\n')[0]
        })
      }
    }

    // ------------------------------
    //   📝 CREAR MENSAJE DE ESTADO
    // ------------------------------

    let report = "🛠 *Reporte de actualización*\n\n"
    report += messager + "\n\n"

    if (uniqueFiles.length > 0) {
      report += `📂 *Plugins modificados:* ${uniqueFiles.length}\n`
      report += uniqueFiles.map(f => `- ${f}`).join('\n') + "\n\n"
    }

    if (errorPlugins.length === 0) {
      report += `✅ *Se actualizaron correctamente ${okPlugins.length} plugins sin errores de sintaxis.*`
    } else {
      report += `⚠️ *Se detectaron errores en ${errorPlugins.length} plugin(s):*\n\n`
      report += errorPlugins.map(e => `❌ *${e.file}*\n   ➤ ${e.error}`).join('\n\n')
    }

    // Enviar reporte
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
