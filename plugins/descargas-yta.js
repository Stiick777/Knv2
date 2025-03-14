import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import { exec } from 'child_process';

const handler = async (m, { args, conn }) => {
  if (!args[0]) 
    return m.reply('*[❗𝐈𝐍𝐅𝐎❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙈𝘼𝙎 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀*');

  const youtubeLink = args[0];

  // Expresión regular mejorada para validar enlaces de YouTube
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(\S*)?$/;

if (!youtubeRegex.test(youtubeLink)) {
  return m.reply('*[❗𝐄𝐑𝐑𝐎𝐑❗] 𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝙋𝙍𝙊𝙋𝙊𝙍𝘾𝙄𝙊𝙉𝘼𝘿𝙊 𝙉𝙊 𝙀𝙎 𝙑𝘼́𝙇𝙄𝘿𝙊. 𝘼𝙎𝙀𝙂𝙐́𝙍𝘼𝙏𝙀 𝘿𝙀 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝙍 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀.*');
}

   
        try {
            await m.react('🕓'); // Reaccionar mientras procesa

            // URL de la API para obtener el audio
            const apiUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(youtubeLink)}`;
            let apiResponse = await fetch(apiUrl);
            let response = await apiResponse.json();

            // Verificar si la API devolvió un resultado válido
            if (response.status === true && response.data && response.data.dl) {
                const { dl, title } = response.data;

                let originalPath = './temp_audio.mp3';
                let convertedPath = './converted_audio.mp3';

                // Descargar el audio
                const audioResponse = await axios.get(dl, { responseType: 'arraybuffer' });
                fs.writeFileSync(originalPath, audioResponse.data);

                // Convertir el audio a un formato compatible con WhatsApp (64kbps, 44100Hz)
                await new Promise((resolve, reject) => {
                    exec(`ffmpeg -i ${originalPath} -ar 44100 -ab 64k -y ${convertedPath}`, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // Enviar el audio convertido
                await conn.sendMessage(m.chat, {
                    audio: fs.readFileSync(convertedPath),
                    mimetype: 'audio/mp4',
                    ptt: false, // Enviar como audio normal
                    fileName: `${title}.mp3`,
                }, { quoted: m });

                // Eliminar archivos temporales
                fs.unlinkSync(originalPath);
                fs.unlinkSync(convertedPath);

                return await m.react('✅'); // Reacción de éxito
            }

            throw new Error("API falló o no retornó datos válidos");
        } catch (error) {
            console.warn("Error en la API:", error.message);
            await m.reply("❌ Error al procesar la solicitud. Inténtalo mas tarde.");
        }

};

handler.help = ['yta'];
handler.tags = ['descargas'];
handler.command = /^yta|audio|fgmp3|dlmp3|mp3|getaud|yt(a|mp3|mp3)$/i;
handler.group = true;

export default handler;