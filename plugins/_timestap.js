export async function before(m) {
  if (!m.text || !global.prefix.test(m.text)) return;

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  if (!command) return;

  const user = global.db.data.users[m.sender];
  const now = Date.now();
  const cooldown = 60 * 1000; // 1 minuto

  // Verifica si el usuario debe esperar antes de ejecutar cualquier comando
  if (user.lastCommandTime && now - user.lastCommandTime < cooldown) {
    const remaining = ((cooldown - (now - user.lastCommandTime)) / 1000).toFixed(0);
    return m.reply(`《✦》Ya tienes una solicitud pendiente.\nDebes esperar *${remaining} segundos* antes de usar otro comando.`);
  }

  // Si pasa la validación, actualizamos el tiempo inmediatamente
  user.lastCommandTime = now;

  // Aquí puedes omitir la validación del comando si no te importa si existe o no
  user.commands = (user.commands || 0) + 1;
}
