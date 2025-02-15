import axios from 'axios';
const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  generateWAMessageContent,
  getDevice
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(message.chat, "❕️ *¿QUÉ BÚSQUEDA DESEA REALIZAR EN TIKTOK?*", message);
  }

  async function createVideoMessage(url) {  
  const absoluteUrl = `https://api.agungny.my.id${url}`; // Agrega la URL base  
  const { videoMessage } = await generateWAMessageContent({  
    video: { url: absoluteUrl }  
  }, {  
    upload: conn.waUploadToServer  
  });  
  return videoMessage;  
}

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  try {
    conn.reply(message.chat, '✨️ *ENVIANDO SUS RESULTADOS POR FAVOR ESPERE..*', message, {
      contextInfo: {   
        externalAdReply: {   
          mediaUrl: null,   
          mediaType: 1,   
          showAdAttribution: true,  
          title: '♡  ͜ ۬︵࣪᷼⏜݊᷼𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨⏜࣪᷼︵۬ ͜ ',  
          body: '✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰',  
          previewType: 0,   
          thumbnail: imagen3,  
          sourceUrl: cn   
        }  
      }  
    });

    let results = [];
    let { data } = await axios.get(`https://api.agungny.my.id/api/tiktok-search?q=${text}`);
let searchResults = data.result.videos; // Accede correctamente al array de videos

    if (searchResults.length === 0) {
      return conn.reply(message.chat, "❌️ *NO SE ENCONTRARON RESULTADOS.*", message);
    }

    shuffleArray(searchResults);
    let topResults = searchResults.splice(0, 7);

    for (let result of topResults) {
      results.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰" }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: result.title,
          hasMediaAttachment: true,
          videoMessage: await createVideoMessage(result.play)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
      });
    }

    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: "✨️ RESULTADO DE: " + text
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
    }, {
      quoted: message
    });

    await conn.relayMessage(message.chat, messageContent.message, {
      messageId: messageContent.key.id
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