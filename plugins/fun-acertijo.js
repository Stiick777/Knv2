import fs from 'fs';
import similarity from 'similarity';

const timeout = 60000;
const points = 10;
const threshold = 0.72;

const handler = async (m, { conn, usedPrefix, text }) => {
  conn.tekateki = conn.tekateki || {};
  const id = m.chat;

  // Si el mensaje es un intento de respuesta
  if (id in conn.tekateki && text) {
    const game = conn.tekateki[id];
    const userAnswer = text.toLowerCase().trim();
    const correctAnswer = game.json.response.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      global.db.data.users[m.sender].estrellas = (global.db.data.users[m.sender].estrellas || 0) + game.points;
      m.reply(`🤍 *Respuesta correcta!*\n+${game.points} Centavos`);
      clearTimeout(game.timeout);
      delete conn.tekateki[id];
    } else if (similarity(userAnswer, correctAnswer) >= threshold) {
      m.reply(`Casi lo logras!`);
    } else {
      m.reply('Respuesta incorrecta!');
    }
    return;
  }

  // Si el usuario intenta iniciar un nuevo acertijo cuando ya hay uno activo
  if (id in conn.tekateki) {
    conn.reply(m.chat, 'Todavía hay un acertijo sin responder en este chat', conn.tekateki[id].message);
    return;
  }

  // Carga y selecciona un acertijo al azar
  const tekateki = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];

  const caption = `    
ⷮ🚩 *ACERTIJOS*    
✨️ *${json.question}*    

⏱️ *Tiempo:* ${(timeout / 1000).toFixed(2)} Segundos    
🎁 *Premio:* *+${points}* Centavos 🪙`.trim();

  // Envía el acertijo y guarda la referencia
  const message = await conn.reply(m.chat, caption, m);
  conn.tekateki[id] = {
    message,
    json,
    points,
    timeout: setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.reply(m.chat, `🤍 Se acabó el tiempo!\n*Respuesta:* ${json.response}`, conn.tekateki[id].message);
        delete conn.tekateki[id];
      }
    }, timeout)
  };
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.group = true;
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];

export default handler;