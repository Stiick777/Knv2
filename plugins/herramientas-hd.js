import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  return await response.text();
}

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply('📷 Responde a una imagen válida para mejorarla.');

  await m.react('🎨');

  try {
    let media = await q.download();
    let url = await catbox(media);

    let apiUrl = `https://api.sylphy.xyz/tools/upscale?url=${encodeURIComponent(url)}`;
    let res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let buffer = await res.buffer();

    await conn.sendFile(m.chat, buffer, 'imagen_mejorada.jpg', '✨ Imagen mejorada en HD por IA.', m);
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al mejorar la imagen.');
  }
};

handler.help = ['hd'];
handler.tags = [ 'tools'];
handler.command = /^(hd|enhance|mejorarimg)$/i;
handler.group = true;

export default handler;
