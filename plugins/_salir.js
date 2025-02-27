let handler = async (m, { conn, usedPrefix, command }) => {
    let sock = global.conns.find(bot => bot.user.id === m.sender)
    if (!sock) return conn.reply(m.chat, "❌ No estás conectado como Sub-Bot *use /cou para ser subbot*.", m)

    try {
        sock.ws.close() // Cerrar la conexión WebSocket
        sock.ev.removeAllListeners() // Eliminar todos los eventos

        let index = global.conns.indexOf(sock)
        if (index >= 0) {
            global.conns.splice(index, 1) // Eliminar de la lista global de conexiones
        }

        let pathSession = `./${sock.authState.creds.me.id.split('@')[0]}/creds.json`
        if (fs.existsSync(pathSession)) fs.unlinkSync(pathSession) // Eliminar el archivo de credenciales

        conn.reply(m.chat, "✅ Sub-Bot desconectado con éxito.", m)
    } catch (e) {
        conn.reply(m.chat, "⚠️ Error al desconectar el Sub-Bot.", m)
        console.error(e)
    }
}

handler.command = ['delbs']
handler.tags = ['jadibot']
handler.help = ['delbs']

export default handler