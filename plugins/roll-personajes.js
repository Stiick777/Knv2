/*import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('❀ No se pudo cargar el archivo characters.json.');
    }
}

let myCharactersHandler = async (m, { conn }) => {
    const userId = m.sender;

    try {
        const characters = await loadCharacters();
        const userCharacters = characters.filter(c => c.user === userId);

        if (userCharacters.length === 0) {
            return await conn.reply(m.chat, `⫷✦⫸ No tienes personajes reclamados. ⫷✦⫸`, m);
        }

        let message = `⫷✨⫸ *Tus Personajes Reclamados* ⫷✨⫸\n\n`;
userCharacters.forEach((char, index) => {
    message += `⭐ *${index + 1}.* ${char.name} ─ 🏆 Valor: *${char.value}* XP\n`;
});

        await conn.reply(m.chat, message, m);

    } catch (error) {
        await conn.reply(m.chat, `✘ Error al obtener los personajes: ${error.message}`, m);
    }
};

myCharactersHandler.help = ['mispersonajes'];
myCharactersHandler.tags = ['fun'];
myCharactersHandler.command = ['mp', 'mispersonajes'];
myCharactersHandler.group = true

export default myCharactersHandler;
*/
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

let myCharactersHandler = async (m, { conn, args }) => {
    const userId = m.sender;

    try {
        const characters = await loadCharacters();
        const userCharacters = characters.filter(c => c.user === userId);

        if (userCharacters.length === 0) {
            return await conn.reply(m.chat, `⫷✦⫸ No tienes personajes reclamados. ⫷✦⫸`, m);
        }

        const pageSize = 10;
        const totalPages = Math.ceil(userCharacters.length / pageSize);
        const page = args[0] ? Math.max(1, Math.min(parseInt(args[0]), totalPages)) : 1;

        const startIndex = (page - 1) * pageSize;
        const paginatedCharacters = userCharacters.slice(startIndex, startIndex + pageSize);

        let message = `⫷✨⫸ *Tus Personajes Reclamados* ⫷✨⫸\n`;
        message += `📄 Página ${page} de ${totalPages}\n\n`;

        paginatedCharacters.forEach((char, i) => {
            message += `⭐ *${startIndex + i + 1}.* ${char.name} ─ 🏆 Valor: *${char.value}* XP\n`;
        });

        // ⬅⬅⬅ Botones como arreglo plano de objetos
        const buttons = [];

        if (page > 1) {
            buttons.push({ buttonText: { displayText: `⬅ Página ${page - 1}` }, buttonId: `.mp ${page - 1}`, type: 1 });
        }

        if (page < totalPages) {
            buttons.push({ buttonText: { displayText: `➡ Página ${page + 1}` }, buttonId: `.mp ${page + 1}`, type: 1 });
        }

        await conn.sendMessage(m.chat, {
            text: message,
            footer: '🌸 NexusBot',
            buttons,
            headerType: 1
        }, { quoted: m });

    } catch (error) {
        await conn.reply(m.chat, `✘ Error al obtener los personajes: ${error.message}`, m);
    }
};

myCharactersHandler.help = ['mp [número]'];
myCharactersHandler.tags = ['fun'];
myCharactersHandler.command = /^mp$/i;
myCharactersHandler.group = true;

export default myCharactersHandler;
