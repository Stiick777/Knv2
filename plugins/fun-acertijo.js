import fs from 'fs';
import similarity from 'similarity';

const timeout = 60000;
const poin = 10;
const threshold = 0.72;

const handler = async (m, { conn, usedPrefix }) => {
  conn.tekateki = conn.tekateki || {};
  const id = m.chat;

  if (id in conn.tekateki) {
    conn.reply(m.chat, 'Todavía hay un acertijo sin responder en este chat.', conn.tekateki[id][0]);
    return;
  }

  const tekateki = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];

  const caption = `
ⷮ🚩 *ACERTIJOS*
✨️ *${json.question}*

⏱️ *Tiempo:* ${(timeout / 1000).toFixed(2)} segundos
🎁 *Premio:* *+${poin}* Centavos 🪙`.trim();

  conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m),
    json,
    poin,
    setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.reply(m.chat, `🤍 Se acabó el tiempo!\n*Respuesta:* ${json.response}`, conn.tekateki[id][0]);
        delete conn.tekateki[id];
      }
    }, timeout),
  ];
};

handler.before = async function (m) {
  const id = m.chat;

  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^ⷮ/i.test(m.quoted.text)) return true;
  if (!(id in this.tekateki)) return m.reply('✨️ Ese acertijo ya ha terminado!');

  const [msg, json, points, timeoutID] = this.tekateki[id];

  if (m.quoted.id === msg.id) {
    if (m.text.toLowerCase().trim() === json.response.toLowerCase().trim()) {
      global.db.data.users[m.sender].estrellas = (global.db.data.users[m.sender].estrellas || 0) + points;
      m.reply(`🤍 *Respuesta correcta!*\n+${points} Centavos`);
      clearTimeout(timeoutID);
      delete this.tekateki[id];
    } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold) {
      m.reply('Casi lo logras!');
    } else {
      m.reply('Respuesta incorrecta!');
    }
  }

  return true;
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];
handler.group = true;

export default handler;