let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '[ 🌟 ] Ingresa el nombre de la aplicación que quieres descargar. Ejemplo:\nClash Royale', m, rcanal);
  }

  const MAX_SIZE_MB = 100;

  try {
    await m.react('🕛');
    let resDelirius = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${args[0]}`);
    let resultDelirius = await resDelirius.json();

    if (resultDelirius.status && resultDelirius.data) {
      let { name, size, image, download, developer, publish, id } = resultDelirius.data;
      let sizeMB = parseFloat(size);

      // if (sizeMB > MAX_SIZE_MB) {
      //   await m.react('❌');
      //   return conn.reply(m.chat, `⚠️ La aplicación "${name}" supera los ${MAX_SIZE_MB}MB (${size}MB). No se puede descargar.`, m, rcanal);
      // }

      let textoDelirius = `  ❯───「 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 」───❮\n` +
        `✦ 𝐍𝐨𝐦𝐛𝐫𝐞 : ⇢ ${name} 📛\n` +
        `✦ 𝐓𝐚𝐦𝐚𝐧̃𝐨 : ⇢ ${size} ⚖️\n` +
        `✦ 𝐃𝐞𝐬𝐚𝐫𝐫𝐨𝐥𝐥𝐚𝐝𝐨𝐫 : ⇢ ${developer} 🛠️\n` +
        `✦ 𝐈𝐃 : ⇢ ${id} 🆔\n` +
        `✦ 𝐅𝐞𝐜𝐡𝐚 𝐝𝐞 𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐜𝐢𝐨́𝐧 : ⇢ ${publish} 📅\n\n` +
        `## Su aplicación se enviará en un momento POR FAVOR ESPERE . . .`;

      await conn.sendFile(m.chat, image, name + '.jpg', textoDelirius, m);
      await conn.sendMessage(m.chat, {
        document: { url: download },
        mimetype: 'application/vnd.android.package-archive',
        fileName: name + '.apk',
        caption: ''
      }, { quoted: m });
      await m.react('✅');
      return;
    }
  } catch (error) {
    console.error('Error en la API de Delirius:', error.message);
  }

  try {
    await m.react('🕛');
    let resDorratz = await fetch(`https://api.dorratz.com/v2/apk-dl?text=${args[0]}`);
    let resultDorratz = await resDorratz.json();
    let { name, size, lastUpdate, icon, dllink: URL, package: packe } = resultDorratz;
    let sizeMB = parseFloat(size);

    // if (sizeMB > MAX_SIZE_MB) {
    //   await m.react('❌');
    //   return conn.reply(m.chat, `⚠️ La aplicación "${name}" supera los ${MAX_SIZE_MB}MB (${size}MB). No se puede descargar.`, m, rcanal);
    // }

    let textoDorratz = `  ❯───「 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 」───❮\n` +
      `✦ 𝐍𝐨𝐦𝐛𝐫𝐞 : ⇢ ${name} 📛\n` +
      `✦ 𝐓𝐚𝐦𝐚𝐧̃𝐨 : ⇢ ${size} ⚖️\n` +
      `✦ 𝐏𝐚𝐜𝐤𝐚𝐠𝐞 : ⇢ ${packe} 📦\n` +
      `✦ 𝐀𝐜𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐝𝐨 : ⇢ ${lastUpdate} 🗓️\n\n` +
      `## Su aplicación se enviará en un momento POR FAVOR ESPERE . . .`;

    await conn.sendFile(m.chat, icon, name + '.jpg', textoDorratz, m);
    await conn.sendMessage(m.chat, {
      document: { url: URL },
      mimetype: 'application/vnd.android.package-archive',
      fileName: name + '.apk',
      caption: ''
    }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    await m.react('❌');
    conn.reply(m.chat, '[❗] No se pudo encontrar ni descargar la aplicación solicitada. Intenta de nuevo más tarde.', m, rcanal);
    console.error('Error en la descarga de APK:', error.message);
  }
};

handler.command = ['apk', 'apkdl', 'modapk'];
handler.help = ['apk'];
handler.tags = ['descargas'];
handler.group = true;
export default handler;