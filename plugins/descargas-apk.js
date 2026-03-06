let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat,
      '[ 🌟 ] Ingresa el nombre de la aplicación que quieres descargar.\nEjemplo:\n.apk simcity',
      m
    );
  }

  const query = encodeURIComponent(args.join(" "));
  const MAX_SIZE_MB = 100;

  try {
    await m.react('🕛');

    let res = await fetch(`https://api.delirius.store/download/apk?query=${query}`);
    let json = await res.json();

    if (!json.status || !json.data) throw "No encontrado";

    let { name, size, image, download, developer, publish, id } = json.data;

    let texto = `❯───「 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 」───❮
✦ 𝐍𝐨𝐦𝐛𝐫𝐞 : ⇢ ${name} 📛
✦ 𝐓𝐚𝐦𝐚𝐧̃𝐨 : ⇢ ${size} ⚖️
✦ 𝐃𝐞𝐬𝐚𝐫𝐫𝐨𝐥𝐥𝐚𝐝𝐨𝐫 : ⇢ ${developer} 🛠️
✦ 𝐈𝐃 : ⇢ ${id} 🆔
✦ 𝐅𝐞𝐜𝐡𝐚 : ⇢ ${publish} 📅

⌛ Enviando aplicación...`;

    await conn.sendFile(
      m.chat,
      image,
      `${name}.jpg`,
      texto,
      m
    );

    await conn.sendMessage(
      m.chat,
      {
        document: { url: download },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${name}.apk`
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (e) {
    console.log("Error Delirius:", e);

    await m.react('❌');
    conn.reply(
      m.chat,
      '❗ No se pudo encontrar la aplicación solicitada.',
      m
    );
  }
};

handler.command = ['apk', 'apkdl', 'modapk'];
handler.help = ['apk <nombre>'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;
