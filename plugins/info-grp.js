var handler = async (m, { conn }) => {
    let groups = Object.entries(conn.chats)
        .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce);

    let totalGrupos = groups.length;
    let listaGrupos = groups
        .map(([jid, chat], index) => `📌 *${index + 1}.* ${chat.subject}\n🔹 *ID:* ${jid}`)
        .join('\n\n');

    let texto = `📢 *Lista de Grupos (${totalGrupos} en total)*\n\n${listaGrupos || 'No estás en ningún grupo activo.'}`;

    m.react('📜');
    conn.reply(m.chat, texto, m);
}

handler.help = ['grupos'];
handler.tags = ['main'];
handler.command = ['grp', 'listagrupos'];
export default handler;