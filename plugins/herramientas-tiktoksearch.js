import axios from 'axios';
const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  generateWAMessageContent,
  getDevice
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
  if (!text) {
    return conn.reply(message.chat, "❕️ *¿QUÉ BÚSQUEDA DESEA REALIZAR EN TIKTOK?*", message);
  }

  async function createVideoMessage(url) {
    const { videoMessage } = await generateWAMessageContent(
      { video: { url } },
      { upload: conn.waUploadToServer }
    );
    return videoMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

 try {
    // Reacción de espera ⌛️
    await conn.sendMessage(message.chat, {
      react: { text: "⌛", key: message.key }
    });

    let { data } = await axios.get(`https://api.agungny.my.id/api/tiktok-search?q=${encodeURIComponent(text)}`);

    if (!data.result || !data.result.videos.length) {
      return conn.reply(message.chat, "❌ No se encontraron resultados.", message);
    }

    let searchResults = data.result.videos;
    shuffleArray(searchResults); // Mezcla los resultados aleatoriamente
    let topResults = searchResults.slice(0, 7); // Tomamos los 7 primeros

    let results = [];

   const BASE_URL = "https://api.agungny.my.id"; // URL base de la API

for (let result of topResults) {
  results.push({
    body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
    footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "By ✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰" }),
    header: proto.Message.InteractiveMessage.Header.fromObject({
      title: result.title || "Sin título",
      hasMediaAttachment: true,
      videoMessage: await createVideoMessage(`${BASE_URL}${result.play}`) // Agregar BASE_URL
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
  });
}
    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `✨️ RESULTADOS DE: ${text}`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "By ✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards: [...results]
            })
          })
        }
      }
    }, { quoted: message });

    await conn.relayMessage(message.chat, messageContent.message, {
      messageId: messageContent.key.id
    });

    // Reacción de éxito ✅
    await conn.sendMessage(message.chat, {
      react: { text: "✅", key: message.key }
    });

  } catch (error) {
    console.error(error);
    conn.reply(message.chat, `❌️ *OCURRIÓ UN ERROR:* ${error.message}`, message);
  }
};

handler.help = ["tiktoksearch <txt>"];
handler.group = true;
handler.tags = ["buscador"];
handler.command = ["tiktoksearch", "tts", "tiktoks"];

export default handler;