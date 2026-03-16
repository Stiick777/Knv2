let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let vcard = `BEGIN:VCARD
VERSION:3.0
N:;Stiiven;;
FN:Stiiven
TITLE:
item1.TEL;waid=5493705452891:5493705452891
item1.X-ABLabel:Stiiven
item2.URL:https://wa.me/5493705452891
item2.X-ABLabel:Enviar Mensaje
END:VCARD`;

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: 'KanBot', 
            contacts: [{ vcard }] 
        } 
    }, { quoted: m });
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
