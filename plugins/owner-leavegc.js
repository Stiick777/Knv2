let handler = async (m, { conn, text, command, isOwner, isGroup }) => {
    // Si está en un chat privado y no se proporciona un ID de grupo, rechazar el comando
    if (!isGroup && (!text || !text.endsWith('@g.us'))) return m.reply('❌ Este comando solo funciona en grupos o debes proporcionar un ID válido.');

    let id = text && text.endsWith('@g.us') ? text : m.chat; // Si hay un ID, usarlo; si no, usar el grupo actual

    

    try {
        let groupMetadata = await conn.groupMetadata(id).catch(() => null);
        if (!groupMetadata) return m.reply('❌ Ese grupo no existe o el bot no está en él.');

        let chat = global.db.data.chats[id];
        if (chat) chat.welcome = false;

        await conn.reply(id, `🚩 *KanBot* abandona el grupo. ¡Fue genial estar aquí! Chau 👋`);
        await conn.groupLeave(id);

        await new Promise(resolve => setTimeout(resolve, 2000));

        let stillInGroup = await conn.groupMetadata(id).catch(() => null);
        if (stillInGroup) {
            await m.reply('❌ No pude salir del grupo. Puede que no tenga permisos.');
        } else {
            await m.reply(`✅ Me salí del grupo ${id} correctamente.`);
        }

        if (chat) chat.welcome = true;
    } catch (e) {
        console.log(e);
        await m.reply('❌ Ocurrió un error al intentar salir del grupo.');
    }
};

handler.command = ['salir', 'leavegc', 'salirdelgrupo', 'leave'];
handler.group = true; // Permitir en grupos
handler.rowner = true; // Solo el owner del bot puede usarlo

export default handler;
