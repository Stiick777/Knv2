import { fetch } from "undici";

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args[0]) {
            return conn.reply(m.chat, `🌱 Ejemplo de uso: ${usedPrefix}${command} https://www.mediafire.com/file/c2fyjyrfckwgkum/ZETSv1%25282%2529.zip/file`, m);
        }

        if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) {
            return conn.reply(m.chat, `Enlace inválido.`, m);
        }

        m.react('🕒');

        const json = await mediafire(args[0]);

        if (!json.filename) {
            return conn.reply(m.chat, "No se pudo obtener la información del archivo.", m);
        }

        let info = `
🌙 \`Nombre :\` ${json.filename}
🔆 \`Link :\` ${args[0]}
☢️ \`Mime :\` ${json.mimetype}

⚠️ Enviando archivo *Por favor espere*
`;
        m.reply(info);

        await conn.sendFile(m.chat, json.dl_url, json.filename, "", m, null, {
            asDocument: true,
            mimetype: json.mimetype
        });

        m.react("✅️");

    } catch (e) {
        m.react("❌️");
        return conn.reply(m.chat, `Error: ${e.message}`, m);
    }
};

handler.command = handler.help = ['mf2'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;

async function mediafire(url) {
    const api = `https://api.sylphy.xyz/download/mediafire?url=${encodeURIComponent(url)}&apikey=sylphy-25c2`;
    const res = await fetch(api);
    if (!res.ok) throw new Error("Error al conectar con la API");
    const data = await res.json();
    if (!data.status) throw new Error("La API no devolvió resultados");

    return data.data;
}
