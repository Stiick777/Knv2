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

let myCharactersHandler = async (m, { conn, command }) => {
    const userId = m.sender;

    try {
        const characters = await loadCharacters();
        const userCharacters = characters.filter(c => c.user === userId);

        if (userCharacters.length === 0) {
            return await conn.reply(m.chat, `⫷✦⫸ No tienes personajes reclamados. ⫷✦⫸`, m);
        }

        const pageSize = 10;
        const pageMatch = command.match(/\d+$/);
        const page = pageMatch ? parseInt(pageMatch[0]) : 1;

        const totalPages = Math.ceil(userCharacters.length / pageSize);

        // 🚫 Si el usuario pidió una página que no tiene, no respondemos
        if (page < 1 || page > totalPages) return;

        const startIndex = (page - 1) * pageSize;
        const paginatedCharacters = userCharacters.slice(startIndex, startIndex + pageSize);

        let message = `⫷✨⫸ *Tus Personajes Reclamados: ${userCharacters.length}* ⫷✨⫸\n\n`;

        paginatedCharacters.forEach((char, index) => {
            message += `⭐ *${startIndex + index + 1}.* ${char.name} ─ 🏆 Valor: *${char.value}* XP\n`;
        });

        message += `\n📄 Página ${page} de ${totalPages}`;
        if (page < totalPages) {
            message += `\n➡ Usa *.mp${page + 1}* para ver la siguiente página.`;
        }

        await conn.reply(m.chat, message, m);

    } catch (error) {
        console.error(error); // silencioso en caso de error no crítico
    }
};

myCharactersHandler.help = ['mp'];
myCharactersHandler.tags = ['fun'];
myCharactersHandler.command = /^mp\d*$/i;
myCharactersHandler.group = true;

export default myCharactersHandler;
