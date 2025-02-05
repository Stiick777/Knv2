var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `💥 *Ingrese un texto a preguntar*\n\n💣 Ejemplo: ${usedPrefix + command} ¿Hoy estallaremos algo?`, m);

    const username = '@' + m.sender.split('@')[0]; // Obtiene el username del usuario que envió el mensaje
    await m.react('❔');
    await delay(1000 * 1);
    await m.react('❓');
    await delay(1000 * 1);
    await m.react('❔');
    await delay(1000 * 1);

    let res = [
        'Si', 
        'Tal vez sí', 
        'Posiblemente', 
        'Probablemente no', 
        'No', 
        'Imposible', 
        'tal vez no',
        'quizas',
        'para nada',
        'siempre',
        'Por eso te dejo tu ex', 
        'No te dire la respuesta', 
        'quien sabe' 
    ].getRandom();

    await conn.reply(m.chat, `👤 ${username}\n\n• *Pregunta:* ${text}\n• *Respuesta:* ${res}`, m);
};

handler.help = ['pregunta'];
handler.tags = ['fun'];
handler.command = ['pregunta', 'preguntas'];
handler.group = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));