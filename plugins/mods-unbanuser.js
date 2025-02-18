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
const handler = async (m, { conn, args, usedPrefix }) => {
    let db = global.db.data.users;
    let user;

    // Función para limpiar caracteres no deseados
    function cleanNumber(number) {
        return number.replace(/\s/g, '').replace(/([@+-])/g, '');
    }

    // Determinar el usuario correctamente
    if (m.quoted?.sender) {
        user = m.quoted.sender;
    } else if (args.length >= 1) {
        const input = cleanNumber(args[0]);
        user = isNaN(input) ? input.split`@`[1] + '@s.whatsapp.net' : input + '@s.whatsapp.net';
    } else if (m.mentionedJid?.[0]) {
        user = m.mentionedJid[0];
    } else {
        return conn.reply(
            m.chat,
            `🚩 *Etiqueta, responde al mensaje o escribe el número del usuario que deseas desbanear.*\n\nEjemplo:\n- *${usedPrefix}unbanuser @usuario*\n- *${usedPrefix}unbanuser +573223336363*`,
            m
        );
    }

    if (!user) return conn.reply(m.chat, `🚩 No se pudo determinar el usuario.`, m);

    // Buscar usuario en la base de datos
    let foundUser = Object.keys(db).find(jid => jid.includes(user.replace('@s.whatsapp.net', '')));

    if (!foundUser) return conn.reply(m.chat, `🚩 El usuario no está registrado en la base de datos.`, m);
    
    if (!db[foundUser].banned) {
        return conn.reply(m.chat, `🚩 El usuario ya está desbaneado.`, m);
    }

    // Resetear todas las propiedades relacionadas con el baneo
    db[foundUser].banned = false;
    db[foundUser].BannedReason = '';
    db[foundUser].Banneduser = false;
    db[foundUser].banRazon = '';
    db[foundUser].antispam = 0; // Resetear spam

    const nametag = await conn.getName(foundUser);
    conn.reply(
        m.chat,
        `✅️ El usuario *${nametag || foundUser.split('@')[0]}* ha sido desbaneado y puede volver a usar el bot.`,
        m,
        { mentions: [foundUser] }
    );
};

handler.help = ['unbanuser <@tag|número>'];
handler.command = ['unbanuser'];
handler.tags = ['owner'];
handler.rowner = true;

export default handler;