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
    
    let msg = await conn.sendMessage(m.chat, { text: `🤔 *A ver si puedes resolverlo...*\n\n${ac.pregunta}` }, { quoted: m });
    
    // Guardamos el acertijo con su ID de mensaje
    global.acertijos[msg.key.id] = { respuesta: ac.respuesta.toLowerCase(), chat: m.chat };
  } else if (m.quoted && global.acertijos[m.quoted.id]) {
    // Si el mensaje es respuesta a un acertijo
    let acertijo = global.acertijos[m.quoted.id];
    
    if (m.text.toLowerCase() === acertijo.respuesta) {
      delete global.acertijos[m.quoted.id]; // Eliminamos el acertijo resuelto
      conn.sendMessage(m.chat, { text: "🎉 ¡Correcto! Eres un genio 🤯" }, { quoted: m });
    } else {
      conn.sendMessage(m.chat, { text: "❌ Incorrecto. ¡Sigue intentándolo!" }, { quoted: m });
    }
  }
};

handler.command = ["acertijo"];
export default handler;