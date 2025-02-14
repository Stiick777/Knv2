import fs from 'fs';
import similarity from 'similarity';

const timeout = 60000; // 60 segundos
const points = 5000; // XP ganada por acertijo
const threshold = 0.72; // Umbral de similitud para respuestas cercanas

const handler = async (m, { conn }) => {
  conn.tekateki = conn.tekateki || {};
  const id = m.chat;

  if (id in conn.tekateki) {
    return conn.reply(m.chat, '⚠️ Ya hay un acertijo activo en este chat. Resuélvelo antes de iniciar otro.', conn.tekateki[id].message);
  }

  // Cargar acertijos desde el archivo JSON
  const tekateki = JSON.parse(fs.readFileSync('./src/game/acertijo.json'));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];

  const caption = `
ⷮ🚩 *ACERTIJO - KANBOT*
✨️ *${json.question}*

⏱️ *Tiempo:* ${(timeout / 1000).toFixed(0)} segundos
🎁 *Premio:* *+${points} XP* ⚡
  
📝 *Responde con la respuesta correcta en este mensaje.*`.trim();

  conn.tekateki[id] = {
    message: await conn.reply(m.chat, caption, m),
    json,
    points,
    timeout: setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.reply(m.chat, `⏳ *¡Tiempo agotado!*\nLa respuesta correcta era: *${json.response}*`, conn.tekateki[id].message);
        delete conn.tekateki[id];
      }
    }, timeout),
  };
};

handler.before = async function (m) {
  const id = m.chat;
  this.tekateki = this.tekateki || {};

  if (!(id in this.tekateki)) return;

  let { message, json, points, timeout } = this.tekateki[id];

  if (!m.quoted || m.quoted.id !== message.id) return;

  let userResponse = m.text.toLowerCase().trim();
  let correctAnswer = json.response.toLowerCase().trim();

  if (userResponse === correctAnswer) {
    global.db.data.users[m.sender].exp += points;
    m.reply(`✅ ¡Respuesta correcta!\n🎉 Has ganado *+${points} XP* ⚡`);
    clearTimeout(timeout);
    delete this.tekateki[id];
  } else if (similarity(userResponse, correctAnswer) >= threshold) {
    m.reply(`🤏 ¡Casi! Estás muy cerca, inténtalo de nuevo.`);
  } else {
    m.reply(`❌ Respuesta incorrecta. ¡Sigue intentando hasta que se acabe el tiempo!`);
  }
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.group = true;
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];

export default handler;