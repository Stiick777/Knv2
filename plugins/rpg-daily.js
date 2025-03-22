const free = 25;
const prem = 15;

var handler = async (m, { conn, isPrems }) => {
  let exp = `${pickRandom([500, 600, 700, 800, 900, 999, 1000, 1300, 1500, 1800, 2000, 2500, 3000])}` * 1;
  let exppremium = `${pickRandom([3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000])}` * 1;
  let estrellas = Math.floor(Math.random() * 3000) + 100; // Estrellas aleatorias entre 100 y 3000
  
  let time = global.db.data.users[m.sender].lastclaim + 86400000; // 24 Horas
  if (new Date - global.db.data.users[m.sender].lastclaim < 86400000) 
    return conn.reply(m.chat, `🕚 *Vuelve en ${msToTime(time - new Date())}*`, m, rcanal);

  global.db.data.users[m.sender].exp += isPrems ? exppremium : exp;
  global.db.data.users[m.sender].estrellas += estrellas; // Se suman estrellas
  
  conn.reply(m.chat, `🎁 *Recompensa Diaria*

📜 Recursos:
✨ *XP:* +${isPrems ? exppremium : exp} ⚡
⭐ *Estrellas:* +${estrellas} 🌟`, m, rcanal);

  global.db.data.users[m.sender].lastclaim = new Date * 1;
};

handler.help = ['daily'];
handler.tags = ['rpg'];
handler.command = ['daily', 'claim'];
handler.group = true;

export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ' Horas ' + minutes + ' Minutos';
}
