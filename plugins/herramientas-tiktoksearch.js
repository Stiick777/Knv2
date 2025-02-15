
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
    const { videoMessage } = await generateWAMessageContent({    
      video: { url }    
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
    conn.reply(message.chat, '✨️ *ENVIANDO SUS RESULTADOS, POR FAVOR ESPERE...*', message);    

    let { data } = await axios.get(`https://api.vreden.my.id/api/search/tiktok?query=${encodeURIComponent(text)}`);    
    let searchResults = data.result.videos;    

    if (!searchResults.length) {    
      return conn.reply(message.chat, "❌ *NO SE ENCONTRARON RESULTADOS.*", message);    
    }    

    shuffleArray(searchResults);    
    let topResults = searchResults.slice(0, 7);    
    let results = [];    

    for (let result of topResults) {    
      results.push({    
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),    
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "📌 TikTok Search" }),    
        header: proto.Message.InteractiveMessage.Header.fromObject({    
          title: result.title || "Video de TikTok",    
          hasMediaAttachment: true,    
          videoMessage: await createVideoMessage(result.play)    
        }),    
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })    
      });    
    }    

    const messageContent = generateWAMessageFromContent(message.chat, {    
      viewOnceMessage: {    
        message: {    
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({    
            body: proto.Message.InteractiveMessage.Body.create({    
              text: "✨ RESULTADOS DE: " + text    
            }),    
            footer: proto.Message.InteractiveMessage.Footer.create({    
              text: "By ✰ 𝙺𝚊𝚗𝙱𝚘𝚝 ✰"    
            }),    
            header: proto.Message.InteractiveMessage.Header.create({    
              hasMediaAttachment: false    
            }),    
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({    
              cards: results    
            })    
          })    
        }    
      }    
    }, { quoted: message });    

    await conn.relayMessage(message.chat, messageContent.message, {    
      messageId: messageContent.key.id    
    });    
  } catch (error) {    
    console.error(error);    
    conn.reply(message.chat, `❌ *OCURRIÓ UN ERROR:* ${error.message}`, message);    
  }    
};    

handler.help = ["tiktoksearch <txt>"];    
handler.group = true;    
handler.tags = ["buscador"];    
handler.command = ["tiktoksearch", "tts", "tiktoks"];    

export default handler;