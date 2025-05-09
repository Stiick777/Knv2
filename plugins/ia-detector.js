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

let handler = async (m, { conn, text, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply('Responde a una imagen válida.');

  if (!text) return m.reply('Por favor, escribe una pregunta junto con el comando.');

  await m.react('👻');

  try {
    let media = await q.download();
    let url = await catbox(media);

    let apiUrl = `https://bk9.fun/ai/geminiimg?url=${encodeURIComponent(url)}&q=${encodeURIComponent(text)}`;
    let res = await fetch(apiUrl);
    let json = await res.json();

    if (!json.status) throw json;


    await m.reply(json.BK9 || 'No se pudo obtener una respuesta.');

  } catch (e) {
    console.error(e);
    m.reply('Error al procesar la imagen o la pregunta.');
  }
};
handler.help = ['iaq <img + txt>']
handler.tags = ['ai']
handler.group = true;
handler.command = /^iaq$/i;
export default handler;
