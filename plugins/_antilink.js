let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i;

let allowedLinks = [
    "https://chat.whatsapp.com/C5xsN9KcmIs8O1wNeOkcX9",
    "https://whatsapp.com/channel/0029VakhAHc5fM5hgaQ8ed2N"
];

export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return !0;
    if (!m.isGroup) return !1;
    
    let chat = global.db.data.chats[m.chat];
    let delet = m.key.participant;
    let bang = m.key.id;
    let bot = global.db.data.settings[this.user.jid] || {};
    
    const isGroupLink = linkRegex.exec(m.text);
    const grupo = `https://chat.whatsapp.com`;
    
    // Permitir admins enviar enlaces
    if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
        return conn.reply(m.chat, `⚠️ *Hey!! el anti link está activo pero eres admin, ¡salvado!*`, m, );
    }
    
    // Si el anti-link está activado y el mensaje contiene un enlace
    if (chat.antiLink && isGroupLink && !isAdmin) {
        // Permitir los enlaces específicos
       if (allowedLinks.some(link => m.text.includes(link))) {
            return !0; // No eliminar el mensaje ni expulsar
        }

        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
            if (m.text.includes(linkThisGroup)) return !0;
        }

        // Si el bot no es admin, no puede eliminar usuarios
        if (!isBotAdmin) {
            return conn.reply(m.chat, `⚡ *No soy admin, no puedo eliminar intrusos*`, m, );
        }

        // Eliminar mensaje y expulsar usuario
        if (isBotAdmin) {
            await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        } else if (!bot.restrict) {
            return conn.reply(m.chat, `*¡Esta característica está desactivada!*`, m, rcanal);
        }
    }
    
    return !0;
}
