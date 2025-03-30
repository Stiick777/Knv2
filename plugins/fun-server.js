import { randomInt } from 'crypto';

const handler = async (m, { conn, participants }) => {
  if (!m.isGroup) {
    return m.reply('Este comando solo funciona en grupos.');
  }

  if (participants.length < 2) {
    return m.reply('No hay suficientes participantes en el grupo.');
  }

  const winnerIndex = randomInt(participants.length);
  const winner = participants[winnerIndex];

  const message = `🎉 ¡El ganador del server es @${winner.id.split('@')[0]}! 🎉`;
  
  await conn.sendMessage(m.chat, { text: message, mentions: [winner.id] });
};

handler.command = ['server'];
handler.group = true;
handler.rowner = true

export default handler;