import fs from 'fs';

const gam = new Map(); // Mapa para almacenar las trivias activas

function cargarPreguntas() {
  try {
    const data = fs.readFileSync('./src/game/trivia.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error cargando preguntas de trivia:", error);
    return [];
  }
}

function elegirPreguntaAleatoria(preguntas) {
  return preguntas[Math.floor(Math.random() * preguntas.length)];
}

let handler = async (m, { conn }) => {
  if (gam.has(m.sender)) {
    return conn.reply(m.chat, "⚠️ Ya tienes una trivia en curso. ¡Responde antes de iniciar otra!", m);
  }

  let preguntas = cargarPreguntas();
  if (preguntas.length === 0) {
    return conn.reply(m.chat, "⚠️ No hay preguntas disponibles en este momento.", m);
  }

  let pregunta = elegirPreguntaAleatoria(preguntas);
  gam.set(m.sender, { pregunta });

  let mensaje = `🎲 *Trivia*\n\n*${pregunta.pregunta}*\n\n`;
  for (const [key, value] of Object.entries(pregunta.opciones)) {
    mensaje += `*${key.toUpperCase()}.* ${value}\n`;
  }
  mensaje += `\n📌 *Responde con A, B o C.*`;

  conn.reply(m.chat, mensaje, m);
};

handler.before = async (m, { conn }) => {
  let juego = gam.get(m.sender);
  if (!juego) return;

  let respuestaUsuario = m.text.toLowerCase().trim();
  
  if (!["a", "b", "c"].includes(respuestaUsuario)) return; // Solo permite A, B o C

  let { pregunta } = juego;
  let respuestaCorrecta = pregunta.respuestaCorrecta;

  gam.delete(m.sender);

  if (respuestaUsuario === respuestaCorrecta) {
    return conn.reply(m.chat, `🎉 ¡Correcto! ✅ La respuesta era *${respuestaCorrecta.toUpperCase()}*`, m);
  } else {
    return conn.reply(m.chat, `❌ Incorrecto. La respuesta correcta era *${respuestaCorrecta.toUpperCase()}*`, m);
  }
};

handler.command = /^trivia$/i;
handler.tags = ['fun'];
handler.help = ['trivia'];
handler.group = true;

export default handler;