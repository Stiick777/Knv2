let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '[ 🌟 ] Ingresa el nombre de la aplicación que quieres descargar. Ejemplo:\nClash Royale', m);
  }

  try {
    let resDelirius = await fetch(`https://deliriussapi-oficial.vercel.app/download/apk?query=${args[0]}`);
    let resultDelirius = await resDelirius.json();

    if (resultDelirius.status && resultDelirius.data) {
      let { name, size, image, download, developer, publish, id } = resultDelirius.data;
      let textoDelirius = `  ❯───「 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 」───❮
        ✦ 𝐍𝐨𝐦𝐛𝐫𝐞 : ⇢ ${name} 📛
        ✦ 𝐓𝐚𝐦𝐚𝐧̃𝐨 : ⇢ ${size} ⚖️
        ✦ 𝐃𝐞𝐬𝐚𝐫𝐫𝐨𝐥𝐥𝐚𝐝𝐨𝐫 : ⇢ ${developer} 🛠️
        ✦ 𝐈𝐃 : ⇢ ${id} 🆔
        ✦ 𝐅𝐞𝐜𝐡𝐚 𝐝𝐞 𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐜𝐢𝐨́𝐧 : ⇢ ${publish} 📅

    ## Su aplicación se enviará en un momento POR FAVOR ESPERE . . .`;

      await conn.sendFile(m.chat, image, name + '.jpg', textoDelirius, m);
      await conn.sendMessage(m.chat, { document: { url: download }, mimetype: 'application/vnd.android.package-archive', fileName: name + '.apk', caption: '' }, { quoted: m });
    } else {
      throw new Error('No se encontraron resultados en la API de Delirius');
    }
  } catch (error) {
    try {
      let resDorratz = await fetch(`https://api.dorratz.com/v2/apk-dl?text=${args[0]}`);
      let resultDorratz = await resDorratz.json();
      let { name, size, lastUpdate, icon, dllink: URL, package: packe } = resultDorratz;

      let textoDorratz = `  ❯───「 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 」───❮
        ✦ 𝐍𝐨𝐦𝐛𝐫𝐞 : ⇢ ${name} 📛
        ✦ 𝐓𝐚𝐦𝐚𝐧̃𝐨 : ⇢ ${size} ⚖️
        ✦ 𝐏𝐚𝐜𝐤𝐚𝐠𝐞 : ⇢ ${packe} 📦
        ✦ 𝐀𝐜𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐝𝐨 : ⇢ ${lastUpdate} 🗓️

    ## Su aplicación se enviará en un momento POR FAVOR ESPERE . . .`;

      await conn.sendFile(m.chat, icon, name + '.jpg', textoDorratz, m);
      await conn.sendMessage(m.chat, { document: { url: URL }, mimetype: 'application/vnd.android.package-archive', fileName: name + '.apk', caption: '' }, { quoted: m });
    } catch (error) {
      conn.reply(m.chat, '[❗] No se pudo encontrar ni descargar la aplicación solicitada. Intenta de nuevo mas tarde.', m, rcanal);
      console.error('Error en la descarga de APK:', error.message);
    }
  }
};

handler.command = ['apk', 'apkdl', 'modapk'];
handler.help = ['apkdl'];
handler.tags = ['descargas'];
handler.group = true;
export default handler;
