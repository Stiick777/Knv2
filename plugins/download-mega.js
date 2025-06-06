
import fetch from 'node-fetch';
import { File } from 'megajs'; 
import path from 'path';

var handler = async (m, { conn, args, usedPrefix, command, isOwner, isPrems }) => {
    var limit;
    if (isOwner || isPrems) {
        limit = 1000; // 1 GB
    } else {
        limit = 600; // 600 MB
    }

    if (!args[0]) {
        return m.reply(`*[❗𝐈𝐍𝐅𝐎❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙈𝙀𝙂𝘼*\n\n❕ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix}mega* https://mega.nz/file/yourfileid#yourfilekey`);
    }

  const megaRegex = /^(https?:\/\/)?(www\.)?(mega\.nz|mega\.co\.nz)\/(file|folder)\/[a-zA-Z0-9_-]+(#|\?|!)[a-zA-Z0-9_-]+$/i;

if (!megaRegex.test(args[0])) {
  return m.reply(`[❗𝐈𝐍𝐅𝐎❗] *LINK INCORRECTO*\nAsegúrate de que el enlace sea un link válido de MEGA.`);
}

    try {
        m.react('⏳'); 

        const fileUrl = args[0];
        const file = File.fromURL(fileUrl);
        await file.loadAttributes();

        // Limitar el tamaño del archivo si es necesario
        const fileSize = file.size;
        const isLimit = limit * 1024 * 1024 < fileSize;

        if (isLimit) {
            return m.reply(`*[❗𝐈𝐍𝐅𝐎❗] El archivo es demasiado grande para descargar. El límite es de ${limit}MB.*`);
        }

        const buffer = await file.downloadBuffer();

        const fileName = file.name;
        const fileExtension = path.extname(fileName).toLowerCase();
        const mimeTypes = {
            ".mp4": "video/mp4",
            ".pdf": "application/pdf",
            ".zip": "application/zip",
            ".rar": "application/x-rar-compressed",
            ".7z": "application/x-7z-compressed",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".apk": "application/vnd.android.package-archive", 
        };
        let mimetype = mimeTypes[fileExtension] || "application/octet-stream";

        await conn.reply(m.chat, 
            `💌 *Nombre:* ${fileName}\n📊 *Peso:* ${formatBytes(fileSize)}\n*🧿 Enviando, por favor espera...*\n> Mientras esperas, sígueme en mi canal, crack 😎`,
            m,
            {
                contextInfo: {
                    externalAdReply: {
                       mediaUrl: null,
                        mediaType: 1,
                        showAdAttribution: true,
                        title: packname,  
                        body: wm,        
                        previewType: 0,
                        sourceUrl: channel 
                    }
                }
            }
        );

        await conn.sendFile(m.chat, buffer, fileName, '', m, null, { mimetype, asDocument: true });

        m.react('✅');

    } catch (e) {
        m.react('❌'); 
        m.reply(`*[❗𝐈𝐍𝐅𝐎❗] 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍𝙇𝙊. 𝘿𝙀𝘽𝙀 𝘿𝙀 𝙎𝙀𝙍 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝙑𝘼𝙇𝙄𝘿𝙊 𝘿𝙀 𝙈𝙀𝙂𝘼*`);
        console.log(e);
    }
}

handler.help = ['mega'];
handler.tags = ['descargas'];
handler.command = ['mega'];
handler.group = true;

export default handler;

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
