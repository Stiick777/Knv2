import fs from 'fs';
import similarity from 'similarity';

const timeout = 60000;
const poin = 10;
const threshold = 0.72;

const handler = async (m, { conn, usedPrefix }) => {
  conn.tekateki = conn.tekateki || {};
  const id = m.chat;

  if (id in conn.tekateki) {
    conn.reply(m.chat, 'Todavía hay acertijos sin responder en este chat', conn.tekateki[id][0]);
    throw false;
  }

  const tekateki = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];
  const clue = json.response.replace(/[A-Za-z]/g, '_');

  const caption = `
ⷮ🚩 *ACERTIJOS*
✨️ *${json.question}*

⏱️ *Tiempo:* ${(timeout / 1000).toFixed(2)} Segundos
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

  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^ⷮ/i.test(m.quoted.text)) return !0;
  this.tekateki = this.tekateki || {};
  if (!(id in this.tekateki)) return m.reply('✨️ Ese acertijo ya ha terminado!');

  if (m.quoted.id === this.tekateki[id][0].id) {
    const json = this.tekateki[id][1];

    if (m.text.toLowerCase().trim() === json.response.toLowerCase().trim()) {
      global.db.data.users[m.sender].estrellas += this.tekateki[id][2];
      m.reply(`🤍 *Respuesta correcta!*\n+${this.tekateki[id][2]} Centavos`);
      clearTimeout(this.tekateki[id][3]);
      delete this.tekateki[id];
    } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold) {
      m.reply(`Casi lo logras!`);
    } else {
      m.reply('Respuesta incorrecta!');
    }
  }

  return !0;
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.group = true;
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];
handler.exp = 0;

export default handler;