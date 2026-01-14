import axios from "axios";
const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
  if (!text) {
    return conn.reply(
      message.chat,
      "❕ *¿QUÉ BÚSQUEDA DESEA REALIZAR EN TIKTOK?*",
      message
    );
  }

  // 🎥 Crear mensaje de video
  async function createVideoMessage(url) {
    const { data } = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data);

    const { videoMessage } = await generateWAMessageContent(
      {
        video: buffer,
        mimetype: "video/mp4"
      },
      { upload: conn.waUploadToServer }
    );

    return videoMessage;
  }

  // 🔀 Mezclar resultados
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  try {
    await conn.sendMessage(message.chat, {
      react: { text: "⌛", key: message.key }
    });

    const { data } = await axios.get(
      `https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(text)}`
    );

    if (!data.data || !data.data.length) {
      throw new Error("No se encontraron resultados");
    }

    let results = data.data;
    shuffleArray(results);

    let cards = [];

    for (let result of results.slice(0, 7)) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text:
            `👤 ${result.author}\n` +
            `👁 ${result.views.toLocaleString()} | ❤️ ${result.likes.toLocaleString()}\n` +
            `💬 ${result.comments.toLocaleString()} | 🔁 ${result.share.toLocaleString()}`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: "TikTok Search"
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: result.title?.slice(0, 80) || "TikTok Video",
          hasMediaAttachment: true,
          videoMessage: await createVideoMessage(result.nowm)
        }),
        nativeFlowMessage:
          proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: []
          })
      });
    }

    const msg = generateWAMessageFromContent(
      message.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage:
              proto.Message.InteractiveMessage.fromObject({
                body: {
                  text: `✨ RESULTADOS DE: *${text}*`
                },
                footer: {
                  text: "By ✰ KanBot ✰"
                },
                carouselMessage: { cards }
              })
          }
        }
      },
      { quoted: message }
    );

    await conn.relayMessage(message.chat, msg.message, {
      messageId: msg.key.id
    });

    await conn.sendMessage(message.chat, {
      react: { text: "✅", key: message.key }
    });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(message.chat, {
      react: { text: "❌", key: message.key }
    });
    conn.reply(
      message.chat,
      `❌ *ERROR:* ${err.message}`,
      message
    );
  }
};

handler.help = ["tiktoksearch <texto>"];
handler.tags = ["buscador"];
handler.command = ["tiktoksearch", "tts", "tiktoks"];
handler.group = true;

export default handler;
