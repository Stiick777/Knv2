import { readdirSync, unlinkSync, promises as fs } from 'fs'
import path from 'path'

var handler = async (m, { conn, usedPrefix }) => {
    if (global.conn.user.jid !== conn.user.jid) {
        return conn.reply(m.chat, '💡 *Utiliza este comando en el número principal del Bot*', m)
    }

    let chatId = m.isGroup ? m.chat : m.sender;
    let sessionPath = './blackSession/';

    try {
        // Forzar la actualización de claves
        await conn.groupMetadata(chatId);
        await conn.sendPresenceUpdate('available', chatId);

        let files = await fs.readdir(sessionPath);
        let filesDeleted = 0;
        
        for (let file of files) {
            if (file.includes(chatId.split('@')[0])) {
                await fs.unlink(path.join(sessionPath, file));
                filesDeleted++;
            }
        }

        if (filesDeleted === 0) {
            await conn.reply(m.chat, '❌ *No se encontró ninguna clave de sesión para actualizar*', m);
        } else {
            await conn.reply(m.chat, `🔰 *Se eliminaron ${filesDeleted} claves de sesión y se regenerarán automáticamente*`, m);
            await conn.reply(m.chat, `⚡ *¡Hola! ¿Logras verme ahora?*`, m);
        }
    } catch (err) {
        console.error('Error al actualizar las claves de cifrado:', err);
        await conn.reply(m.chat, '❌ *Ocurrió un fallo al intentar actualizar las claves*', m);
    }
};

handler.help = ['fixkeys'];
handler.tags = ['fix'];
handler.command = ['fixkeys'];

export default handler;