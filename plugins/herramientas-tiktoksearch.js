import axios from "axios";

const baileys = await import("@whiskeysockets/baileys");

const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = baileys;

let handler = async (message, { conn, text }) => {
  if (!text) {
    return conn.reply(
      message.chat,
      "❕ *¿QUÉ BÚSQUEDA DESEA REALIZAR EN TIKTOK?*",
      message
    );
  }

  async function createVideoMessage(url) {
    const { data } = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        Referer: "https://www.tiktok.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const buffer = Buffer.from(data);

    const { videoMessage } = await generateWAMessageContent(
      {
        video: buffer,
        mimetype: "video/mp4"
      },
      {
        upload: conn.waUploadToServer
      }
    );

    return videoMessage;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  try {
    await conn.sendMessage(message.chat, {
      react: {
        text: "⌛",
        key: message.key
      }
    });

    const { data } = await axios.get(
      `https://api.delirius.store/search/tiktoksearch?query=${encodeURIComponent(
        text
      )}`
    );

    if (!data?.meta?.length) {
      throw new Error("No se encontraron resultados");
    }

    let results = data.meta;
    shuffleArray(results);

    let cards = [];

    for (const result of results.slice(0, 7)) {
      try {
        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text:
              `👤 ${result.author?.nickname || "Desconocido"}\n` +
              `👁 ${Number(result.play || 0).toLocaleString()}\n` +
              `❤️ ${Number(result.like || 0).toLocaleString()} | 💬 ${Number(
                result.coment || 0
              ).toLocaleString()}\n` +
              `🔁 ${Number(result.share || 0).toLocaleString()}`
          }),

          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: `🎵 ${
              result.music?.title || "Audio no disponible"
            }`
          }),

          header: proto.Message.InteractiveMessage.Header.fromObject({
            title:
              result.title?.slice(0, 80) ||
              "TikTok Video",
            hasMediaAttachment: true,
            videoMessage: await createVideoMessage(result.hd)
          }),

          nativeFlowMessage:
            proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Ver en TikTok",
                    url: result.url
                  })
                }
              ]
            })
        });
      } catch (e) {
        console.error(
          "Error cargando video:",
          result.id,
          e.message
        );
      }
    }

    if (!cards.length) {
      throw new Error(
        "No fue posible generar las tarjetas."
      );
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
                  text: `✨ *RESULTADOS DE:* ${text}`
                },

                footer: {
                  text: `🔎 Se encontraron ${results.length} resultados\nby ☆KanBot☆`
                },

                header: {
                  hasMediaAttachment: false
                },

                carouselMessage: {
                  cards
                }
              })
          }
        }
      },
      {
        quoted: message
      }
    );

    await conn.relayMessage(
      message.chat,
      msg.message,
      {
        messageId: msg.key.id
      }
    );

    await conn.sendMessage(message.chat, {
      react: {
        text: "✅",
        key: message.key
      }
    });
  } catch (err) {
    console.error(err);

    await conn.sendMessage(message.chat, {
      react: {
        text: "❌",
        key: message.key
      }
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
