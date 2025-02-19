const handler = async (m, { text }) => {
    let colores = ["🔴 Rojo", "🔵 Azul", "🟢 Verde", "🟡 Amarillo", "🟠 Naranja", "⚫ Negro", "🟣 Morado"];
    let xpGanar = 5000;
    let xpPerder = 2500;
    
    if (!text) {
        return m.reply(`📍 Escribe el color que quieras:\n${colores.join(", ")}\n> Ejemplo /color verde`);
    }

    let eleccion = text.toLowerCase();
    let colorBot = colores[Math.floor(Math.random() * colores.length)];
    
    // Verificar que solo el usuario que envió el comando pueda elegir
    if (m.mentionedJid?.length) {
        return m.reply("❌ Solo el usuario que envió el comando puede elegir el color.");
    }

    if (colores.some(c => c.toLowerCase().includes(eleccion))) {
        if (colorBot.toLowerCase().includes(eleccion)) {
            let bonus = colorBot.includes("🟣") ? xpGanar * 2 : xpGanar;
            global.db.data.users[m.sender].exp += bonus;
            return m.reply(`📍 El color cayó en: ${colorBot}\n✅ ¡Felicidades! Elegiste el color correcto.\n🎁 Ganaste *${bonus} XP*`);
        } else {
            global.db.data.users[m.sender].exp -= xpPerder;
            return m.reply(`📍 El color cayó en: ${colorBot}\n❌ Perdiste, prueba de nuevo.\n😢 Perdiste *${xpPerder} XP*`);
        }
    } else {
        return m.reply(`❌ Color no válido. Usa uno de estos:\n${colores.join(", ")}`);
    }
};

handler.tags = ['fun']
handler.help = ['color']
handler.command = ["color"];
handler.group = true
export default handler;