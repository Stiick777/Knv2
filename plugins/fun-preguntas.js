var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `💥 *Ingrese un texto a preguntar*\n\n💣 Ejemplo: ${usedPrefix + command} ¿Hoy estallaremos algo?`, m);

    // Detectar LID según el contexto
    let userLid = m.sender // por defecto el autor del mensaje
    if (m.quoted) {
        userLid = m.quoted.sender // si se responde a alguien
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        userLid = m.mentionedJid[0] // si se etiqueta a alguien
    }

    const username = '@' + userLid.split('@')[0]; // construimos el username/LID

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
        'Tal vez no',
        'Quizás',
        'Para nada',
        'Siempre',
        'Por eso te dejó tu ex', 
        'No te diré la respuesta', 
        'Quién sabe' 
    ].getRandom();

    await conn.reply(
        m.chat, 
        `👤 ${username}\n\n• *Pregunta:* ${text}\n• *Respuesta:* ${res}`, 
        m,
        { mentions: [userLid] } // para que notifique al usuario
    );
};

handler.help = ['pregunta'];
handler.tags = ['fun'];
handler.command = ['pregunta', 'preguntas', 'answer'];
handler.group = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
