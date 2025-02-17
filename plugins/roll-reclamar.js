import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';
const cooldowns = {};

// 🔹 Usar `global.timestamps` para compartir entre archivos
if (!global.timestamps) global.timestamps = {}; 

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

let claimHandler = async (m, { conn }) => {
    const userId = m.sender;
    const now = Date.now();

    if (cooldowns[userId] && now < cooldowns[userId]) {  
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000);  
        const minutes = Math.floor(remainingTime / 60);  
        const seconds = remainingTime % 60;  
        return await conn.reply(m.chat, `⫷✦⫸ Debes esperar ⏳ *${minutes} minutos y ${seconds} segundos* para usar *#rc* de nuevo. ⫷✦⫸`, m);  
    }  

    if (m.quoted && m.quoted.sender === conn.user.jid) {  
        try {  
            const characters = await loadCharacters();  
            const characterIdMatch = m.quoted.text.match(/ID: \*(.+?)\*/);  
              
            if (!characterIdMatch) {  
                await conn.reply(m.chat, `⫷✦⫸ El mensaje citado no es un personaje válido. ⫷✦⫸`, m);
                return;
            }

            const characterId = characterIdMatch[1];  
            const character = characters.find(c => c.id === characterId);  

            if (!character) {  
                await conn.reply(m.chat, '《✧》El personaje no existe.', m);  
                return;  
            }  

            // 🔹 Verificar si el personaje ya fue reclamado
            if (character.user) {
                const userTag = `@${character.user.split('@')[0]}`;
                await conn.reply(m.chat, `⫷✦⫸ ❌ *Este personaje ya ha sido reclamado.* ❌\nFue reclamado por ${userTag}.`, m, { mentions: [character.user] });
                return;
            }

            // 🔹 Verificar si el tiempo ha expirado
            const expirationTime = global.timestamps[character.id] || 0;
            if (now > expirationTime) {  
                await conn.reply(
                    m.chat, 
                    `⫷✦⫸ ⏳ *Tiempo Agotado* ⏳ ⫷✦⫸\nEl personaje *${character.name}* ya no puede ser reclamado.`, 
                    m
                );
                delete global.timestamps[character.id]; // Eliminar timestamp si el tiempo expiró
                return;
            }

            // Verificar si el usuario tiene suficiente XP  
            const userXP = global.db.data.users[userId]?.exp || 0;  
            if (userXP < character.value) {  
                const xpFaltante = character.value - userXP; // Calcular cuánto le falta

                await conn.reply(m.chat, `⫷✦⫸ No tienes suficiente XP para reclamar a *${character.name}* ❌.

🔹 Necesitas: ${character.value} XP
🔸 Tienes: ${userXP} XP
❗ Te falta: ${xpFaltante} XP

✨ ¡Sigue acumulando XP y vuelve a intentarlo! ⫷✦⫸`, m);
                return;
            }

            // Restar XP y asignar el personaje al usuario  
            global.db.data.users[userId].exp -= character.value;  
            character.user = userId;  
            character.status = "Reclamado";  

            await saveCharacters(characters);  
            delete global.timestamps[character.id]; // ✅ Borrar timestamp al reclamar  

            await conn.reply(m.chat, `⫷✨⫸ ¡Has reclamado a *${character.name}* con éxito! 🎉`, m);  
            cooldowns[userId] = now + 1 * 60 * 1000;  

        } catch (error) {  
            await conn.reply(m.chat, `✘ Error al reclamar el personaje: ${error.message}`, m);  
        }  
    } else {  
        await conn.reply(m.chat, `✖︎ 》 Debes citar un personaje válido para reclamar. 《 ✖︎`, m);
    }
};

claimHandler.help = ['rc'];
claimHandler.tags = ['fun'];
claimHandler.command = ['rc'];
claimHandler.group = true;

export default claimHandler;