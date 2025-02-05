let cooldowns = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let tiempoEspera = 5

    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
        m.reply(` Ya has iniciado una apuesta recientemente, espera *⏱ ${tiempoRestante}* para apostar nuevamente.`)
        return
    }

    if (!text || !['cara', 'cruz'].includes(text.toLowerCase())) {
        return conn.reply(m.chat, ' Elige una opción ( *Cara o Cruz* ) para probar suerte.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* cara`, m)
    }

    cooldowns[m.sender] = Date.now()
    let resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
    let esGanador = text.toLowerCase() === resultado

    if (esGanador) {
        global.db.data.users[m.sender].cookies += 1000
        conn.reply(m.chat, `︎∆ La moneda cayó en *${resultado}*, ¡ganaste  500xp!`, m)
    } else {
        global.db.data.users[m.sender].cookies -= 500
        conn.reply(m.chat, `∆ La moneda cayó en *${resultado}*, perdiste 500xp.`, m)
    }
}

handler.help = ['cf']
handler.tags = ['fun']
handler.command = ['cf']

export default handler

function segundosAHMS(segundos) {
    return `${segundos % 60} segundos`
}