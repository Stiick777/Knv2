var handler = async (m, { conn, command }) => {
    const canalID = '120363394849526871@newsletter'; // 📌 Canal donde se enviará el test
    let numeroBot = conn.user?.id || 'Desconocido';

    // 🔥 **Corrección del número eliminando todo después de `:`**
    let numeroLimpio = numeroBot.split(':')[0].replace(/[^0-9]/g, '');

    // 🛑 **DETENER EL ENVÍO AUTOMÁTICO DEL TEST**
    if (command === 'stoptest') {
        if (global.testInterval) {
            clearInterval(global.testInterval);
            global.testInterval = null;
            return m.reply('🚫 *El envío automático del test ha sido detenido.*');
        } else {
            return m.reply('⚠️ *No hay un test en ejecución actualmente.*');
        }
    }

    // 📌 **SI EL COMANDO ES `settest`, INICIA EL ENVÍO DEL TEST**
    if (command === 'settest') {
        if (!global.startTime) global.startTime = Date.now(); // 🔥 Guardar el inicio solo si no existe
        await enviarTest(conn, numeroLimpio, canalID);

        // 🔥 **Inicia la ejecución automática si no está en marcha**
        if (!global.testInterval) {
            global.testInterval = setInterval(async () => {
                console.log('⏳ Ejecutando `.settest` automáticamente...');
                conn.ev.emit('messages.upsert', {
                    messages: [{ key: { remoteJid: 'status@broadcast' }, message: { conversation: '.settest' } }]
                });
            }, 5 * 60 * 1000); // 🔥 **Cada 5 minutos**
        }
    }
};

// 📌 **FUNCIÓN PARA ENVIAR EL TEST AUTOMÁTICAMENTE**
async function enviarTest(conn, numeroLimpio, canalID) {
    if (!global.db.data.botsOficiales || !global.db.data.botsOficiales[numeroLimpio]) {
        console.log('⚠️ Este bot aún no ha sido registrado.');
        return;
    }

    let botData = global.db.data.botsOficiales[numeroLimpio];

    // 🔥 **Corrección para asegurarse de que el `status` esté activo**
    let statusBot = botData.status || '🟢 Activo';

    // ⏳ **Calcular el tiempo de ejecución (runtime)**
    let elapsedSeconds = Math.floor((Date.now() - global.startTime) / 1000);
    let runtime = new Date(elapsedSeconds * 1000).toISOString().substr(11, 8); // 🔥 HH:mm:ss

    let mensajeTest = `🚀 *Test de ${botData.nombre}*\n\n` +
        `📞 *Número:* wa.me/${numeroLimpio}\n` +
        `📊 *Status:* ${statusBot}\n` +
        `⏳ *Runtime:* ${runtime}\n` +
        `👥 *Grupos:* ${botData.totalGrupos}`;

    // 📌 **ENVÍA EL TEST AL CANAL**
    await conn.sendMessage(canalID, { text: mensajeTest }).then(() => {
        console.log(`[SETTEST] Test enviado correctamente a ${canalID}`);
    }).catch(err => {
        console.error(`[ERROR] No se pudo enviar el test al canal:`, err);
    });
}

handler.command = ['settest', 'stoptest'];
export default handler;