const handler = async (m, { conn }) => {
  try {
    const settings = global.db.data.settings[conn.user.jid];
    if (typeof settings !== 'object') {
      global.db.data.settings[conn.user.jid] = {};
    }
    const defaultSettings = {
      self: false,
      autoread: false,
      autoread2: false,
      restrict: false,
      antiPrivate: false,
      antiCall: true,
      antiSpam: true,
      modoia: false,
      jadibotmd: false,
      autobio: false,
    };

    // Asegurarse de que todos los valores estén definidos
    for (const key in defaultSettings) {
      if (!(key in settings)) {
        settings[key] = defaultSettings[key];
      }
    }

    const text = `💥 *AJUSTES DEL BOT*
    
◈ *Modo Self:* ${settings.self ? '✅' : '❌'}
◈ *Autoread (Chats):* ${settings.autoread ? '✅' : '❌'}
◈ *Autoread (Grupos):* ${settings.autoread2 ? '✅' : '❌'}
◈ *Restricciones:* ${settings.restrict ? '✅' : '❌'}
◈ *Anti Chats Privados:* ${settings.antiPrivate ? '✅' : '❌'}
◈ *Anti Llamadas:* ${settings.antiCall ? '✅' : '❌'}
◈ *Anti Spam:* ${settings.antiSpam ? '✅' : '❌'}
◈ *Modo IA:* ${settings.modoia ? '✅' : '❌'}
◈ *JadiBotMD:* ${settings.jadibotmd ? '✅' : '❌'}
◈ *AutoBio:* ${settings.autobio ? '✅' : '❌'}
`.trim();

    await conn.reply(m.chat, text, m);
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '⚠️ Ocurrió un error al obtener los ajustes del bot.', m);
  }
};

handler.help = ['ajustesbot'];
handler.tags = ['main'];
handler.command = ['ajustesbot', 'ajustes']; 
handler.owner = true; 

export default handler;
