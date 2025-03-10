let handler = async (m, { conn, text, command, isOwner }) => {
    let id = text && text.endsWith('@g.us') ? text : m.chat; // Si se proporciona un ID de grupo, usarlo; si no, usar el chat actual

    if (!isOwner) return m.reply('🚩 Solo el propietario del bot puede usar este comando.');

    try {
        let groupMetadata = await conn.groupMetadata(id).catch(() => null); // Obtener metadatos del grupo para verificar si existe
        if (!groupMetadata) return m.reply('❌ Ese grupo no existe o el bot no está en él.');

        let chat = global.db.data.chats[id];
        if (chat) chat.welcome = false; // Desactivar mensaje de bienvenida antes de salir

        await conn.reply(id, `🚩 *KanBot* abandona el grupo. ¡Fue genial estar aquí! Chau 👋`);

        await conn.groupLeave(id); // Intentar salir del grupo

        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos para verificar salida

        let stillInGroup = await conn.groupMetadata(id).catch(() => null); // Verificar si el bot sigue en el grupo
        if (stillInGroup) {
            await m.reply('❌ No pude salir del grupo. Puede que no tenga permisos.');
        } else {
            await m.reply('✅ Me salí del grupo correctamente.');
        }

        if (chat) chat.welcome = true; // Restaurar mensaje de bienvenida si el bot reingresa en el futuro
    } catch (e) {
        console.log(e);
        await m.reply('❌ Ocurrió un error al intentar salir del grupo.');
    }
};

handler.command = ['salir', 'leavegc', 'salirdelgrupo', 'leave'];
handler.rowner = true;

export default handler;