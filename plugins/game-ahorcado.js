const palabras = [
  "gato", "perro", "pájaro", "elefante", "tigre", "ballena", "mariposa",
  "tortuga", "conejo", "rana", "pulpo", "ardilla", "jirafa", "cocodrilo",
  "pingüino", "delfín", "serpiente", "hámster", "mosquito", "abeja", "porno",
  "negro", "television", "computadora", "botsito", "reggaeton", "economía",
  "electrónica", "facebook", "WhatsApp", "Instagram", "tiktok", "milanesa",
  "presidente", "bot", "películas"
];

const intentosMaximos = 6;
const gam = new Map();

function elegirPalabraAleatoria() {
  return palabras[Math.floor(Math.random() * palabras.length)];
}

function ocultarPalabra(palabra, letrasAdivinadas) {
  return palabra
    .split("")
    .map(letra => (letrasAdivinadas.includes(letra) ? letra : "_"))
    .join(" ");
}

function mostrarAhorcado(intentos) {
  const dibujo = [
    " ____",
    " |  |",
    intentos < 6 ? " |  O" : " |",
    intentos < 5 ? " | /" : intentos < 4 ? " | / " : intentos < 3 ? " | / \\" : intentos < 2 ? " | / \\ " : " |",
    intentos < 2 ? "_|_" : " |"
  ];
  return dibujo.slice(0, intentosMaximos - intentos).join("\n");
}

function juegoTerminado(sender, palabra, mensaje, intentos) {
  if (intentos === 0) {
    gam.delete(sender);
    return `❌ ¡Perdiste! La palabra correcta era: *${palabra}*\n\n${mostrarAhorcado(intentos)}`;
  } else if (!mensaje.includes("_")) {
    let expGanada = palabra.length >= 8 ? Math.floor(Math.random() * 3500) : Math.floor(Math.random() * 300);
    global.db.data.users[sender].exp += expGanada;
    gam.delete(sender);
    return `¡Que pro Ganaste 🥳! Adivinaste la palabra *"${palabra}"*.\n\n*Has ganado:* ${expGanada} Exp.`;
  }
  return null;
}

let handler = async (m, { conn }) => {
  if (gam.has(m.sender)) {
    return conn.reply(m.chat, "⚠️ Ya tienes un juego en curso. ¡Termina ese primero!", m);
  }

  let palabra = elegirPalabraAleatoria();
  let letrasAdivinadas = [];
  let intentos = intentosMaximos;
  let mensaje = ocultarPalabra(palabra, letrasAdivinadas);

  gam.set(m.sender, { palabra, letrasAdivinadas, intentos });

  let text = `🎮 *Juego del Ahorcado*\n\n🔤 *Adivina la palabra:*\n${mensaje}\n\n💡 *Intentos restantes:* ${intentos}`;
  conn.reply(m.chat, text, m);
};

handler.before = async (m, { conn }) => {
  let juego = gam.get(m.sender);
  if (!juego) return;

  if (typeof m.text === "string" && m.text.length === 1 && /^[a-zA-Z]$/.test(m.text)) {
    let { palabra, letrasAdivinadas, intentos } = juego;
    let letra = m.text.toLowerCase();

    if (!letrasAdivinadas.includes(letra)) {
      letrasAdivinadas.push(letra);
      if (!palabra.includes(letra)) {
        intentos--;
      }
    }

    let mensaje = ocultarPalabra(palabra, letrasAdivinadas);
    let resultado = juegoTerminado(m.sender, palabra, mensaje, intentos);

    if (resultado) {
      gam.delete(m.sender); // Elimina el juego inmediatamente tras ganar o perder
      return conn.reply(m.chat, resultado, m);
    }

    gam.set(m.sender, { palabra, letrasAdivinadas, intentos });
    conn.reply(m.chat, `${mostrarAhorcado(intentos)}\n\n${mensaje}\n\n💡 *Intentos restantes:* ${intentos}`, m);
  }
};

handler.help = ['ahorcado'];
handler.tags = ['fun'];
handler.command = ['ahorcado'];

export default handler;