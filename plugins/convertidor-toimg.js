import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

const LOLHUMAN_APIKEY = '8fdb6bf3e9d527f7a6476f4b';

let handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || '';

  if (!/webp/.test(mime)) {
    return m.reply(`❌ Responde a un *sticker* con *${usedPrefix + command}*`);
  }

  await m.react('🕛');

  try {
    // 1. Descargar sticker
    const media = await q.download();

    // 2. Subir a Catbox
    const imgUrl = await catbox(media);

    // 3. Llamar API lolhuman (BINARIO)
    const apiUrl = `https://api.lolhuman.xyz/api/convert/topng?apikey=${LOLHUMAN_APIKEY}&img=${encodeURIComponent(imgUrl)}`;

    const res = await fetch(apiUrl);
    const buffer = await res.buffer();

    // 4. Enviar imagen real
    await conn.sendFile(
      m.chat,
      buffer,
      'sticker.png',
      null,
      m
    );

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ Error al convertir el sticker');
  }
};

handler.help = ['toimg (reply)'];
handler.tags = ['transformador'];
handler.command = ['toimg', 'img', 'jpg'];
handler.group = true;

export default handler;

/* =======================
   CATBOX UPLOADER
======================= */

async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  if (!ext || !mime) throw new Error('No se pudo detectar el archivo');

  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const name = crypto.randomBytes(5).toString("hex");

  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, `${name}.${ext}`);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}
