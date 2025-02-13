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