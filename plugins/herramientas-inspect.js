// Código adaptado por https://github.com/GataNina-Li
import { getUrlFromDirectPath } from "@whiskeysockets/baileys";

let handler = async (m, { conn, command, text }) => {
  const isCommand1 = /^(inspect|inspeccionar)\b$/i.test(command);

  let fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo",
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split(
          "@"
        )[0]}:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
    participant: "0@s.whatsapp.net",
  };

  const MetadataGroupInfo = async (res) => {
    let nameCommunity = "no pertenece a ninguna Comunidad";
    let groupPicture = "No se pudo obtener";

    if (res.linkedParent) {
      let linkedGroupMeta = await conn
        .groupMetadata(res.linkedParent)
        .catch((e) => null);
      nameCommunity = linkedGroupMeta
        ? "\n" + ("`Nombre:` " + linkedGroupMeta.subject || "")
        : nameCommunity;
    }

    const pp = await conn
      .profilePictureUrl(res.id, "image")
      .catch((e) => null);

    const formatParticipants = (participants) =>
      participants && participants.length > 0
        ? participants
            .map(
              (user, i) =>
                `${i + 1}. @${user.id?.split("@")[0]}${
                  user.admin === "superadmin"
                    ? " (superadmin)"
                    : user.admin === "admin"
                    ? " (admin)"
                    : ""
                }`
            )
            .join("\n")
        : "No encontrado";

    let caption =
      `🆔 *Identificador del grupo:*\n${res.id || "No encontrado"}\n\n` +
      `👑 *Creado por:*\n${
        res.owner ? `@${res.owner?.split("@")[0]}` : "No encontrado"
      } ${
        res.creation
          ? `el ${new Date(res.creation * 1000).toLocaleString()}`
          : "(Fecha no encontrada)"
      }\n\n` +
      `🏷️ *Nombre:*\n${res.subject || "No encontrado"}\n\n` +
      `✏️ *Nombre cambiado por:*\n${
        res.subjectOwner
          ? `@${res.subjectOwner?.split("@")[0]}`
          : "No encontrado"
      } ${
        res.subjectTime
          ? `el ${new Date(res.subjectTime * 1000).toLocaleString()}`
          : "(Fecha no encontrada)"
      }\n\n` +
      `📄 *Descripción:*\n${res.desc || "No encontrado"}\n\n` +
      `🖼️ *Imagen del grupo:*\n${pp || groupPicture}\n\n` +
      `💫 *Comunidad vinculada:* ${
        res.linkedParent
          ? "`Id:` " + res.linkedParent
          : nameCommunity
      }\n\n` +
      `🔰 *Usuarios en total:*\n${res.size || "Cantidad no encontrada"}\n\n`;

    return caption.trim();
  };

  if (isCommand1) {
    if (!text)
      return await conn.reply(
        m.chat,
        "☠️ Ingrese el enlace de un grupo",
        m
      );

    const inviteUrl = text.match(
      /(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:invite\/|joinchat\/)?([0-9A-Za-z]{22,24})/i
    )?.[1];

    if (!inviteUrl)
      return await conn.reply(
        m.chat,
        "*Verifique que sea un enlace de grupo válido.*",
        m
      );

    try {
      const inviteInfo = await conn.groupGetInviteInfo(inviteUrl);
      const info = await MetadataGroupInfo(inviteInfo);

      await conn.sendMessage(
        m.chat,
        {
          text: info,
          contextInfo: {
            mentionedJid: conn.parseMention(info),
          },
        },
        { quoted: fkontak }
      );
    } catch (e) {
      await conn.reply(m.chat, "🥀 Grupo no encontrado.", m);
      console.error(e);
    }
  }
};

handler.tags = ['tools']
handler.help = ['inspect', 'inspeccionar']
handler.command = ['inspect', 'inspeccionar']
handler.group = true;
export default handler