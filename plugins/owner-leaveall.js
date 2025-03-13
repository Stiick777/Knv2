var handler = async (m, { conn }) => {
    let groups = Object.entries(conn.chats)
        .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce);

    let totalGrupos = groups.length;

    if (totalGrupos === 0) {
        return conn.reply(m.chat, '❌ No estoy en ningún grupo.', m);
    }

    conn.reply(m.chat, `🚪 Saliendo de ${totalGrupos} grupos...`, m);

    for (let [jid] of groups) {
        await conn.groupLeave(jid); // Sale del grupo
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos entre cada salida
    }

    conn.reply(m.chat, '✅ He salido de todos los grupos correctamente.', m);
};


handler.command = ['salirgrupos', 'leaveall'];
handler.rowner = true

export default handler;