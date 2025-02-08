import similarity from 'similarity';

const threshold = 0.72;

const handler = async (m, { conn }) => {
  conn.acertijos = conn.acertijos || {};
  const id = m.chat;

  if (!m.quoted || !conn.acertijos[id]) return;

  const { answer, msgId, points, timeoutRef } = conn.acertijos[id];

  if (m.quoted.id !== msgId) return;

  const userAnswer = m.text.toLowerCase().trim();
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
};

handler.customPrefix = /.*/;
handler.command = new RegExp();

export default handler;