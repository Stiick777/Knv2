let handler = async (m, { conn, text, isGroup }) => {
    let id = null;

    if (text && text.endsWith('@g.us')) {
        id = text; // ID válido proporcionado en privado
    } else if (isGroup) {
        id = m.chat; // Se ejecuta desde el mismo grupo
    } else {
        return m.reply('❌ Usa este comando dentro de un grupo o proporciona un ID de grupo válido (termina en @g.us).');
    }

    try {
        // Verifica si el bot realmente está en ese grupo
        const groupMetadata = await conn.groupMetadata(id).catch(() => null);
        if (!groupMetadata) return m.reply('❌ El bot no está en ese grupo o el ID es inválido.');

        // Desactivar bienvenida si existe
        const chat = global.db.data.chats[id];
        if (chat) chat.welcome = false;

        // Mensaje de despedida
        await conn.reply(id, '😮‍💨 *KanBot* abandona el grupo. ¡Fue genial estar aquí! Adiós chol@s 😹');
        await conn.groupLeave(id);

        await m.reply(`✅ Salí correctamente del grupo *${groupMetadata.subject}* (${id})`);

        // Restaurar bienvenida si se desea
        if (chat) chat.welcome = true;

    } catch (e) {
        console.error(e);
        await m.reply('❌ Ocurrió un error al intentar salir del grupo.');
    }
};

handler.command = ['salir', 'leavegc', 'salirdelgrupo', 'leave'];
handler.rowner = true;

export default handler;
