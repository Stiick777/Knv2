/*const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let user;
    let db = global.db.data.users;
    if (m.quoted) {
        user = m.quoted.sender;
    } else if (args.length >= 1) {
        user = args[0].replace('@', '') + '@s.whatsapp.net';
    } else {
        await conn.reply(m.chat, `🚩 Etiqueta o responde al mensaje del usuario que quieras Desbanear, Ejemplo:\n> → *${usedPrefix}unbanuser <@tag>*`, m);
        return;
    }
    if (db[user]) {
        db[user].banned = false;
        db[user].banRazon = '';
        const nametag = await conn.getName(user);
        const nn = conn.getName(m.sender);
        await conn.reply(m.chat, `✅️ El usuario *${nametag}* ha sido desbaneado.`, m, { mentionedJid: [user] });
        
    } else {
        await conn.reply(m.chat, `🚩 El usuario no está registrado.`, m);
    }
};
handler.help = ['unbanuser <@tag>'];
handler.command = ['unbanuser'];
handler.tags = ['owner'];
handler.rowner = true;
handler.group = true;
export default handler;
*/
const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let user;
    let db = global.db.data.users;

    // Función para limpiar el número y eliminar caracteres no deseados
    function no(number) {
        return number.replace(/\s/g, '').replace(/([@+-])/g, '');
    }

    // Determinar el usuario
    if (m.quoted && m.quoted.sender) {
        user = m.quoted.sender;
    } else if (args.length >= 1) {
        const input = no(args[0]);
        user = isNaN(input) ? input.split`@`[1] + '@s.whatsapp.net' : input + '@s.whatsapp.net';
    } else if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else {
        await conn.reply(
            m.chat,
            `🚩 *Etiqueta, responde al mensaje, o escribe el número del usuario que deseas desbanear.*\n\nEjemplo:\n- *${usedPrefix}unbanuser @usuario*\n- *${usedPrefix}unbanuser +573223336363*`,
            m
        );
        return;
    }

    if (!user) {
        await conn.reply(m.chat, `🚩 No se pudo determinar el usuario.`, m);
        return;
    }

    // Verificar si el usuario está en la base de datos
    if (db[user]) {
        if (!db[user].banned) {
            await conn.reply(m.chat, `🚩 El usuario ya está desbaneado.`, m);
            return;
        }
        
        // Solo quitar el baneo, pero mantener los datos del usuario
        db[user].banned = false;
        db[user].banRazon = ''; // Limpiar la razón del baneo
        db[user].antispam = 0; // Reiniciar contador de spam para evitar baneo inmediato

        const nametag = await conn.getName(user);
        await conn.reply(
            m.chat,
            `✅️ El usuario *${nametag || user.split('@')[0]}* ha sido desbaneado y puede volver a usar el bot.`,
            m,
            { mentions: [user] }
        );
    } else {
        await conn.reply(m.chat, `🚩 El usuario no está registrado en la base de datos.`, m);
    }
};

handler.help = ['unbanuser <@tag|número>'];
handler.command = ['unbanuser'];
handler.tags = ['owner'];
handler.rowner = true;

export default handler;