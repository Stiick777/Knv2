let handler = async (m, { conn, text, command, isOwner }) => {
    let id = text && text.endsWith('@g.us') ? text : m.chat; // Si el texto es un ID de grupo válido, úsalo; si no, usa m.chat

    let chat = global.db.data.chats[id];
    if (chat) chat.welcome = false; // Desactivar mensaje de bienvenida antes de salir

    await conn.reply(id, `😮‍💨 *KanBot* abandona el grupo. ¡Fue genial estar aquí! adios chol@s 😹`);

    try {
        await conn.groupLeave(id); // Salir del grupo
        if (chat) chat.welcome = true; // Restaurar mensaje de bienvenida en caso de reingreso
    } catch (e) {
        await m.reply('❌ Error al intentar salir del grupo.');
        console.log(e);
    }
};

handler.command = ['salir', 'leavegc', 'salirdelgrupo', 'leave'];
handler.group = true;
handler.rowner = true;

export default handler;