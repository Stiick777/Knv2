/*var handler = async (m, { conn, participants, usedPrefix, command }) => {
    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, '💡 *Etiqueta o responde al mensaje de la persona que quieres eliminar*', m,  );
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
    //const nn = conn.getName(m.sender);

    if (user === conn.user.jid) {
        return conn.reply(m.chat, '⚠️ No puedo eliminar el bot del grupo', m,  );
    }

    if (user === ownerGroup) {
        return conn.reply(m.chat, '⚡ No puedo eliminar al propietario del grupo', m,  );
    }

    if (user === ownerBot) {
        return conn.reply(m.chat, '🔰 No puedo eliminar al propietario del bot', m,);
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

//conn.reply('573012482597@s.whatsapp.net', `🚩 Un Admin Acabo De Eliminar Un Usuario En El Grupo:\n> ${groupMetadata.subject}.`, m, rcanal, );
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban', 'kc'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
*/
var handler = async (m, { conn, participants, usedPrefix, command }) => {
    // Función auxiliar para normalizar los JIDs
    const normalizeJid = (jid = '') => jid.replace(/@(?:s\.whatsapp\.net|c\.us|lid)$/, '')

    if (!m.mentionedJid?.[0] && !m.quoted) {
        return conn.reply(m.chat, `⚠️ Debes mencionar o responder a un usuario para expulsarlo del grupo.`, m)
    }

    const groupMetadata = await conn.groupMetadata(m.chat)

    const target = m.mentionedJid?.[0] || m.quoted.sender
    const targetNormalized = normalizeJid(target)

    const senderJid = normalizeJid(m.sender)
    const botJid = normalizeJid(conn.user.jid)
    const ownerGroup = normalizeJid(groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net')
    const ownerBot = normalizeJid(global.owner[0][0] + '@s.whatsapp.net')

    // Buscar si el bot es admin
    const participantsData = groupMetadata.participants
    const isBotAdmin = participantsData.find(p => normalizeJid(p.id) === botJid && p.admin)
    const isUserAdmin = participantsData.find(p => normalizeJid(p.id) === senderJid && p.admin)

    if (!isUserAdmin) {
        return conn.reply(m.chat, `🚫 Este comando solo puede ser usado por administradores del grupo.`, m)
    }

    if (!isBotAdmin) {
        return conn.reply(m.chat, `🚫 Necesito ser administrador para poder expulsar usuarios.`, m)
    }

    // Reglas de protección
    if (targetNormalized === botJid) {
        return conn.reply(m.chat, `🤖 No puedo expulsarme a mí mismo.`, m)
    }

    if (targetNormalized === ownerGroup) {
        return conn.reply(m.chat, `👑 No puedo expulsar al propietario del grupo.`, m)
    }

    if (targetNormalized === ownerBot) {
        return conn.reply(m.chat, `🛡️ No puedo expulsar al propietario del bot.`, m)
    }

    // Ejecutar expulsión
    try {
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
        conn.reply(m.chat, `✅ Usuario expulsado correctamente.`, m)
    } catch (e) {
        conn.reply(m.chat, `❌ Error al expulsar: ${e.message}`, m)
    }
}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar', 'kc', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
