var handler = async (m, { conn }) => {
    let numeroBot = conn.user?.id || 'Desconocido'; // ✅ Obtiene el número del bot
    let nombreBot = global.botname || 'Bot Desconocido'; // ✅ Nombre del bot
    let grupos = Object.keys(conn.chats).filter(id => id.endsWith('@g.us')).length; // ✅ Cuenta los grupos

    // 🔥 **Corrección del número**
    let numeroLimpio = numeroBot.split(':')[0].replace(/[^0-9]/g, ''); // 🔥 Elimina todo después de ':' y deja solo los números

    // ✅ Calcula el runtime en formato HH:MM:SS
    let uptime = process.uptime();
    let horas = Math.floor(uptime / 3600);
    let minutos = Math.floor((uptime % 3600) / 60);
    let segundos = Math.floor(uptime % 60);
    let runtime = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    let status = '🟢 Activo'; // ✅ Status por defecto en "Activo"

    // ✅ Se asegura de que `global.db.data.botsOficiales` exista
    if (!global.db.data.botsOficiales) {
        global.db.data.botsOficiales = {};
    }

    // ✅ Guarda/actualiza la información del bot en la base de datos
    global.db.data.botsOficiales[numeroLimpio] = {
        nombre: nombreBot,
        numero: numeroLimpio, // ✅ Guarda solo el número limpio
        status: status,
        runtime: runtime,
        totalGrupos: grupos
    };

    // ✅ Respuesta con todos los datos registrados
    let mensaje = `✅ *Bot registrado correctamente.*\n\n` +
        `🤖 *Nombre:* ${nombreBot}\n` +
        `📞 *Número:* wa.me/${numeroLimpio}\n` + // ✅ Ahora siempre correcto
        `📊 *Status:* ${status}\n` +
        `⏳ *Runtime:* ${runtime}\n` +
        `👥 *Grupos:* ${grupos}`;

    m.reply(mensaje);

    // ✅ Guarda automáticamente en la DB cada 5 minutos
    if (!global.botRegistroInterval) {
        global.botRegistroInterval = setInterval(() => {
            let grupos = Object.keys(conn.chats).filter(id => id.endsWith('@g.us')).length;
            let uptime = process.uptime();
            let horas = Math.floor(uptime / 3600);
            let minutos = Math.floor((uptime % 3600) / 60);
            let segundos = Math.floor(uptime % 60);
            let runtime = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

            if (global.db.data.botsOficiales[numeroLimpio]) {
                global.db.data.botsOficiales[numeroLimpio].runtime = runtime;
                global.db.data.botsOficiales[numeroLimpio].totalGrupos = grupos;
            }

            console.log(`[BOTREGISTRO] Datos actualizados para ${numeroLimpio}`);
        }, 5 * 60 * 1000); // ⏳ Cada 5 minutos
    }
};

handler.command = ['bdb'];
export default handler;