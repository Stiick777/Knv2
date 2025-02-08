import fetch from 'node-fetch';

const acertijos = [
  { pregunta: "Tengo llaves pero no abro puertas. ¿Qué soy?", respuesta: "teclado" },
  { pregunta: "Vuelo sin alas, lloro sin ojos. ¿Qué soy?", respuesta: "nube" },
  { pregunta: "Cuanto más quitas, más grande soy. ¿Qué soy?", respuesta: "agujero" },
  { pregunta: "No tengo boca y grito sin cesar. ¿Qué soy?", respuesta: "viento" },
  { pregunta: "Mientras más lavo, más sucia me pongo. ¿Qué soy?", respuesta: "agua" }
];

// Objeto global para almacenar acertijos activos
global.acertijos = {};

const handler = async (m, { conn, command }) => {
  if (command === "acertijo") {
    let ac = acertijos[Math.floor(Math.random() * acertijos.length)];
    global.acertijos[m.sender] = ac.respuesta.toLowerCase();

    conn.sendMessage(m.chat, { text: `🤔 *A ver si puedes resolverlo...*\n\n${ac.pregunta}` }, { quoted: m });
  } else {
    // Si el usuario responde, verificamos si hay un acertijo pendiente
    let respuestaCorrecta = global.acertijos[m.sender];
    if (respuestaCorrecta && m.text.toLowerCase() === respuestaCorrecta) {
      delete global.acertijos[m.sender]; // Eliminamos el acertijo una vez respondido correctamente
      conn.sendMessage(m.chat, { text: "🎉 ¡Correcto! Eres un genio 🤯" }, { quoted: m });
    } else if (respuestaCorrecta) {
      conn.sendMessage(m.chat, { text: "❌ Incorrecto. ¡Sigue intentándolo!" }, { quoted: m });
    }
  }
};

handler.command = ["acertijo"];
handler.customPrefix = /^(?!acertijo$).*$/; // Maneja todas las respuestas excepto el comando
handler.check = m => global.acertijos[m.sender]; // Verifica si el usuario está respondiendo un acertijo

export default handler;