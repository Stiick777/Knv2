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
    return conn.reply(message.chat, "❕️ *¿QUÉ BÚSQUEDA DESEA REALIZAR EN TIKTOK?*", message, rcanal);
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
await conn.sendMessage(message.chat, {
      react: { text: "⌛", key: message.key }
    });

    let results = [];
    let { data } = await axios.get("https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=" + text);
    let searchResults = data.data;
    shuffleArray(searchResults);
    let topResults = searchResults.splice(0, 7);

    for (let result of topResults) {
      results.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: titulowm }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: '' + result.title,
          hasMediaAttachment: true,
          videoMessage: await createVideoMessage(result.nowm)
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
    await conn.sendMessage(message.chat, {
      react: { text: "✅", key: message.key }
    });
  } catch (error) {
      await conn.sendMessage(message.chat, {
      react: { text: "❌️", key: message.key }
    });
    console.error(error);
    conn.reply(message.chat, `❌️ *OCURRIÓ UN ERROR:* ${error.message}`, message, rcanal);
  }
};

handler.help = ["tiktoksearch <txt>"];
handler.group = true;
handler.tags = ["buscador"];
handler.command = ["tiktoksearch", "tts", "tiktoks"];

export default handler;
