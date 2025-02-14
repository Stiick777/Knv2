let handler = async (m, { conn, args }) => {  
    let elegido = parseInt(args[0]);  

    if (isNaN(elegido) || elegido < 1 || elegido > 6) {  
        return m.reply('🎲 Debes elegir un número entre 1 y 6. Ejemplo: .dado 3');  
    }  

    let resultado = Math.floor(Math.random() * 6) + 1; // Número aleatorio entre 1 y 6  

    // Espacio invisible de ancho fijo (EM SPACE U+2003)  
    let espacio = ' ';  

    let dados = {  
        2: `┌───────┐\n│${espacio}${espacio}●${espacio}${espacio}│\n│${espacio}${espacio}${espacio}${espacio}${espacio}│\n│${espacio}${espacio}●${espacio}${espacio}│\n└───────┘`,  
        1: `┌───────┐\n│${espacio}${espacio}${espacio}${espacio}${espacio}│\n│${espacio}${espacio}●${espacio}${espacio}│\n│${espacio}${espacio}${espacio}${espacio}${espacio}│\n└───────┘`,  
        3: `┌───────┐\n│●${espacio}${espacio}${espacio}${espacio}│\n│${espacio}${espacio}●${espacio}${espacio}│\n│${espacio}${espacio}${espacio}${espacio}●│\n└───────┘`,  
        4: `┌───────┐\n│${espacio}●${espacio}${espacio}●${espacio}│\n│${espacio}${espacio}${espacio}${espacio}${espacio}│\n│${espacio}●${espacio}${espacio}●${espacio}│\n└───────┘`,  
        5: `┌───────┐\n│${espacio}●${espacio}${espacio}●${espacio}│\n│${espacio}${espacio}●${espacio}${espacio}│\n│${espacio}●${espacio}${espacio}●${espacio}│\n└───────┘`,  
        6: `┌───────┐\n│${espacio}●${espacio}${espacio}●${espacio}│\n│${espacio}●${espacio}${espacio}●${espacio}│\n│${espacio}●${espacio}${espacio}●${espacio}│\n└───────┘`  
    };  

    let animacion = [  
        `🎲 *Lanzando el dado...*\n\n┌───────┐\n│${espacio}${espacio}${espacio}${espacio}${espacio}│\n│${espacio}${espacio}${espacio}${espacio}${espacio}│\n│${espacio}${espacio}${espacio}${espacio}${espacio}│\n└───────┘`,  
        `🎲 *El dado gira...*\n\n${dados[Math.floor(Math.random() * 6) + 1]}`,  
        `🎲 *Casi listo...*\n\n${dados[Math.floor(Math.random() * 6) + 1]}`,  
        `🎲 *Resultado final!*\n\n${dados[resultado]}`  
    ];  

    let mensaje = await conn.sendMessage(m.chat, { text: animacion[0] }, { quoted: m });  

    for (let i = 1; i < animacion.length; i++) {  
        await new Promise(resolve => setTimeout(resolve, 1500));  
        await conn.sendMessage(m.chat, { text: animacion[i], edit: mensaje.key });  
    }  

    let mensajeFinal = `🔢 *Tu elección:* ${elegido}\n🎲 *El dado salió:* ${resultado}\n\n`;  

    if (resultado === elegido) {  
        global.db.data.users[m.sender].exp += 5000; // Otorga 100 XP  
        mensajeFinal += '🎉 ¡Felicidades, ganaste! +5000 XP 🏆';  
    } else {  
        mensajeFinal += '😢 Mala suerte, inténtalo de nuevo.';  
    }  

    await new Promise(resolve => setTimeout(resolve, 1000));  
    await conn.sendMessage(m.chat, { text: mensajeFinal, edit: mensaje.key });  
};  

handler.help = ['dado'];  
handler.tags = ['fun'];  
handler.command = ['dado'];  
handler.group = true

export default handler;