import fs from 'fs';

const timeout = 60000;
const points = 10;

const handler = async (m, { conn }) => {
  conn.acertijos = conn.acertijos || {};
  const id = m.chat;

  if (conn.acertijos[id]) {
    return m.reply('⏳ *Aún hay un acertijo sin responder en este chat!*');
  }

  const acertijos = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`));
  const randomAcertijo = acertijos[Math.floor(Math.random() * acertijos.length)];

  const caption = `    
🚩 *ACERTIJO*    
✨ *${randomAcertijo.question}*    

⏱ *Tiempo:* ${(timeout / 1000).toFixed(2)} Segundos    
🎁 *Premio:* *+${points}* Centavos 🪙`.trim();

  const msg = await conn.reply(m.chat, caption, m);

  conn.acertijos[id] = {
    question: randomAcertijo.question,
    answer: randomAcertijo.response,
    msgId: msg.id,
    points,
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