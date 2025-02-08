import fs from 'fs';
import similarity from 'similarity';

const timeout = 60000;
const points = 10;
const threshold = 0.72;

const handler = async (m, { conn, text }) => {
  conn.acertijos = conn.acertijos || {};
  const id = m.chat;

  // Si el usuario está respondiendo a un acertijo
  if (m.quoted && conn.acertijos[id] && m.quoted.id === conn.acertijos[id].msgId) {
    const { answer, msg, timeoutRef } = conn.acertijos[id];
    const userAnswer = text.toLowerCase().trim();
    const correctAnswer = answer.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      global.db.data.users[m.sender].estrellas = (global.db.data.users[m.sender].estrellas || 0) + points;
      m.reply(`✅ *¡Respuesta correcta!*\n+${points} Centavos 🪙`);
      clearTimeout(timeoutRef);
      delete conn.acertijos[id];
    } else if (similarity(userAnswer, correctAnswer) >= threshold) {
      m.reply(`⚠️ *Casi lo logras!*`);
    } else {
      m.reply(`❌ *Respuesta incorrecta!*`);
    }
    return;
  }

  // Si ya hay un acertijo activo
  if (conn.acertijos[id]) {
    return m.reply('⏳ *Aún hay un acertijo sin responder en este chat!*');
  }

  // Cargar un acertijo aleatorio
  const acertijos = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`));
  const randomAcertijo = acertijos[Math.floor(Math.random() * acertijos.length)];

  const caption = `    
🚩 *ACERTIJO*    
✨ *${randomAcertijo.question}*    

⏱ *Tiempo:* ${(timeout / 1000).toFixed(2)} Segundos    
🎁 *Premio:* *+${points}* Centavos 🪙`.trim();

  // Enviar acertijo y guardar la referencia
  const msg = await conn.reply(m.chat, caption, m);
  conn.acertijos[id] = {
    msgId: msg.id,
    answer: randomAcertijo.response,
    msg,
    timeoutRef: setTimeout(() => {
      if (conn.acertijos[id]) {
        conn.reply(m.chat, `⏳ *¡Se acabó el tiempo!*\n📝 *Respuesta correcta:* ${randomAcertijo.response}`, msg);
        delete conn.acertijos[id];
      }
    }, timeout)
  };
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.group = true;
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];

export default handler;