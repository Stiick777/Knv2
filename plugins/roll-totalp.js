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

let charactersInfoHandler = async (m, { conn }) => {
    try {
        const characters = await loadCharacters();

        const totalCharacters = characters.length;
        const claimedCharacters = characters.filter(c => c.user).length;
        const availableCharacters = totalCharacters - claimedCharacters;

      let message = `╔═════════════════════╗  
        ✦ *Información de Personajes* ✦  
╚═════════════════════╝  

📜 *Estadísticas:*  
➤ 🏆 *Total de personajes:* ${totalCharacters}  
➤ ✅ *Personajes reclamados:* ${claimedCharacters}  
➤ 🎭 *Personajes disponibles:* ${availableCharacters}  

━━━━━━━━━━━━━━━━━━━`;

        await conn.reply(m.chat, message, m);

    } catch (error) {
        await conn.reply(m.chat, `✘ Error al obtener información de los personajes: ${error.message}`, m);
    }
};

charactersInfoHandler.help = ['listpersonajes'];
charactersInfoHandler.tags = ['fun'];
charactersInfoHandler.command = ['listp', 'listpersonajes'];
charactersInfoHandler.group = true

export default charactersInfoHandler;
