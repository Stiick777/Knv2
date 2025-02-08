import fs from 'fs';
import similarity from 'similarity';

const timeout = 60000;
const points = 10;
const threshold = 0.72;

const handler = async (m, { conn, usedPrefix }) => {
  conn.tekateki = conn.tekateki || {};
  const id = m.chat;

  if (id in conn.tekateki) {
    return conn.reply(m.chat, '⚠️ Todavía hay un acertijo sin responder en este chat', conn.tekateki[id][0]);
  }

  const tekateki = JSON.parse(fs.readFileSync('./src/game/acertijo.json'));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];

  const caption = `
ⷮ🚩 *ACERTIJOS - KANBOT*
✨️ *${json.question}*

⏱️ *Tiempo:* ${(timeout / 1000).toFixed(2)} segundos
🎁 *Premio:* *+${points}* Centavos 🪙`.trim();

  conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m),
    json,
    points,
    setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.reply(m.chat, `⏳ ¡Tiempo agotado!\n*Respuesta:* ${json.response}`, conn.tekateki[id][0]);
        delete conn.tekateki[id];
      }
    }, timeout)
  ];
};

handler.before = async function (m) {
  const id = m.chat;
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^ⷮ/i.test(m.quoted.text)) return true;

  this.tekateki = this.tekateki || {};
  if (!(id in this.tekateki)) return m.reply('⚠️ Ese acertijo ya ha terminado!');

  if (m.quoted.id === this.tekateki[id][0].id) {
    const json = this.tekateki[id][1];

    if (m.text.toLowerCase().trim() === json.response.toLowerCase().trim()) {
      global.db.data.users[m.sender].estrellas += this.tekateki[id][2];
      m.reply(`✅ ¡Respuesta correcta!\n+${this.tekateki[id][2]} Centavos 🪙`);
      clearTimeout(this.tekateki[id][3]);
      delete this.tekateki[id];
    } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold) {
      m.reply(`🤏 ¡Casi lo logras!`);
    } else {
      m.reply('❌ Respuesta incorrecta!');
    }
  }
  return true;
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.group = true;
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];

export default handler;