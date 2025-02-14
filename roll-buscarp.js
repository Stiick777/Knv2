import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('❀ No se pudo cargar el archivo characters.json.');
    }
}

let buscarHandler = async (m, { conn, text }) => {
    if (!text) {
        return await conn.reply(m.chat, '⫷✦⫸ Debes escribir el nombre de un personaje para buscarlo. ⫷✦⫸', m);
    }

    try {
        const characters = await loadCharacters();
        const filteredCharacters = characters.filter(c => c.name.toLowerCase().includes(text.toLowerCase()));

        if (filteredCharacters.length === 0) {
            return await conn.reply(m.chat, `⫷✦⫸ No se encontró ningún personaje con el nombre *${text}*. ⫷✦⫸`, m);
        }

        if (filteredCharacters.length > 1) {
            let message = `⫷✦⫸ Se encontraron *${filteredCharacters.length}* personajes con el nombre similar a *"${text}"*:\n\n`;
            filteredCharacters.forEach((char, index) => {
                message += `🔹 *${index + 1}.* ${char.name} (ID: ${char.id})\n`;
            });
            message += `\n⫷✦⫸ *Escribe el nombre exacto o usa el ID para buscarlo nuevamente.*`;

            return await conn.reply(m.chat, message, m);
        }

        const character = filteredCharacters[0];
        let message = `╔════════════════╗\n`;
        message += `  ✨ *Personaje Encontrado* ✨\n`;
        message += `╚════════════════╝\n\n`;
        message += `❀ *Nombre:* ${character.name}\n`;
        message += `✰ *Valor:* ${character.value} XP\n`;
        message += `🔹 *ID:* ${character.id}\n`;
        message += `━━━━━━━━━━━━━━━━━━`;

        if (character.img) {
            await conn.sendFile(m.chat, character.img, 'personaje.jpg', message, m);
        } else {
            await conn.reply(m.chat, message, m);
        }

    } catch (error) {
        await conn.reply(m.chat, `✘ Error al buscar el personaje: ${error.message}`, m);
    }
};

buscarHandler.help = ['buscarp <nombre>'];
buscarHandler.tags = ['fun'];
buscarHandler.command = ['buscarp'];

export default buscarHandler;