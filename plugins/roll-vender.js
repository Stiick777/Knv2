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

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
    } catch (error) {
        throw new Error('❀ No se pudo guardar el archivo characters.json.');
    }
}

// Función para normalizar el nombre (quita espacios extras, mayúsculas y caracteres especiales)
function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

let sellHandler = async (m, { conn, args }) => {
    const userId = m.sender;

    if (!args[0]) {
        return await conn.reply(m.chat, `⫷✦⫸ Debes escribir el nombre del personaje que deseas vender. ⫷✦⫸  
✧ Ejemplo: *#sell neko*`, m);
    }

    const characterName = normalizeText(args.join(' ')); // Normaliza el nombre ingresado por el usuario

    try {
        const characters = await loadCharacters();
        const character = characters.find(c => normalizeText(c.name) === characterName);

        if (!character) {
            return await conn.reply(m.chat, `⟪✦⟫ No se encontró el personaje ⟪ *${args.join(' ')}* ⟫. ⟪✦⟫`, m);
        }

        if (character.user !== userId) {
            return await conn.reply(m.chat, `⫷✦⫸ No puedes vender ⟪ *${character.name}* ⟫ porque no te pertenece. ⫷✦⫸`, m);
        }

        const characterValue = character.value || 0;

        // Liberar el personaje
        character.user = null;
        character.status = "Libre";

        // Agregar XP al usuario que vendió el personaje
        global.db.data.users[userId].exp += characterValue;

        await saveCharacters(characters);

        // Mensaje de confirmación con imagen
        const message = `╔════════════════════╗  
      💰 *¡Personaje Vendido!* 💰  
╚════════════════════╝  

✦ Has vendido a *${character.name}* por *${characterValue}* XP.  

🔄 Ahora el personaje está disponible para que otros lo reclamen.  

━━━━━━━━━━━━━━━━━━`;

        await conn.sendFile(m.chat, character.img, `${character.name}.jpg`, message, m);

    } catch (error) {
        await conn.reply(m.chat, `✘ Error al vender el personaje: ${error.message}`, m);
    }
};

sellHandler.help = ['sell <name-personaje>'];
sellHandler.tags = ['fun'];
sellHandler.command = ['sell', 'vender'];
sellHandler.group = true

export default sellHandler;