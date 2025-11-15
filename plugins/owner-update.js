import { execSync } from 'child_process'
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
