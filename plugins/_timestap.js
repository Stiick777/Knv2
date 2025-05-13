export async function before(m) {
  if (!m.text || !global.prefix.test(m.text)) return;

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  if (!command) return;

  const user = global.db.data.users[m.sender];
  const now = Date.now();
  const cooldown = 60 * 1000; // 1 minuto en milisegundos

  // Si el usuario tiene un tiempo registrado y no ha pasado 1 minuto
  if (user.lastCommandTime && now - user.lastCommandTime < cooldown) {
    const remaining = ((cooldown - (now - user.lastCommandTime)) / 1000).toFixed(0);
    return m.reply(`《✦》Ya tienes una solicitud pendiente.\nDebes esperar *${remaining} segundos* antes de usar otro comando.`);
  }

  // Validar si el comando existe en los plugins
  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
        return true;
      }
    }
    return false;
  };

  if (validCommand(command, global.plugins)) {
    user.commands = (user.commands || 0) + 1;
    user.lastCommandTime = now;
  }
}