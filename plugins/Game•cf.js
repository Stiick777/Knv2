let cooldowns = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let tiempoEspera = 5 // 5 segundos de cooldown

    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
        m.reply(`⚠️ Ya has iniciado una apuesta recientemente, espera *⏱ ${tiempoRestante}* para jugar nuevamente.`)
        return
    }

    if (!text || !['cara', 'cruz'].includes(text.toLowerCase())) {
        return conn.reply(m.chat, '🎲 Elige una opción ( *Cara o Cruz* ) para probar suerte.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* cara`, m)
    }

    cooldowns[m.sender] = Date.now()
    let resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
    let esGanador = text.toLowerCase() === resultado

    if (esGanador) {
        global.db.data.users[m.sender].exp += 10000 // Gana 10,000 XP
        conn.reply(m.chat, `🎉 ¡Felicidades! La moneda cayó en *${resultado}* y ganaste *+10,000 XP* ⚡`, m)
    } else {
        global.db.data.users[m.sender].exp -= 5000 // Pierde 5,000 XP
        conn.reply(m.chat, `❌ Mala suerte... La moneda cayó en *${resultado}* y perdiste *-5,000 XP* ❌`, m)
    }
}

handler.help = ['cf']
handler.tags = ['fun']
handler.command = ['cf']

export default handler

function segundosAHMS(segundos) {
    return `${segundos % 60} segundos`
}