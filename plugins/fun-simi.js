import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';

let handler = async (m, { text }) => {
  if (!text) return m.reply('✳️ Escribe algo para que responda.');

  m.react('🗣️');

  try {
    // API key proporcionada
    const apikey = 'b7c31bc85a84460f81247277ef50ac4da50cf68f';

    // Consulta a la API de SimSimi con la API Key
    let res = await fetch(`https://simsimi.ooguy.com/sim?query=${encodeURIComponent(text)}&apikey=${apikey}`);
    let json = await res.json();

    if (json.status !== 200 || !json.respond) {
      return m.reply('❎ No se pudo obtener una respuesta de la API de SimSimi.');
    }

    let responseText = json.respond;

    // Traducción al español
    let translated = await translate(responseText, { to: 'es', autoCorrect: true });

    m.reply('*SimSimi:* ' + translated.text);
  } catch (error) {
    console.error('Error:', error);
    m.reply('❎ Ocurrió un error, intenta de nuevo.');
  }
};

handler.help = ['bot'];
handler.tags = ['fun'];
handler.command = ['bot', 'simi'];

export default handler;
