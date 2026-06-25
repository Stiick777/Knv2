export async function before(m, { conn, isOwner, isROwner }) {
  try {
    // Ignorar mensajes del propio bot enviados por Baileys
    if (m.isBaileys && m.fromMe) return !0

    // Solo actuar en privado
    if (m.isGroup) return !1

    // Si no hay mensaje, salir
    if (!m.message) return !0

    const text = m.text || ''

    // Ignorar ciertas palabras/comandos
    if (
      text.includes('PIEDRA') ||
      text.includes('PAPEL') ||
      text.includes('TIJERA') ||
      text.includes('jad code') ||
      text.includes('code') ||
      text.includes('serbot') ||
      text.includes('jadibot')
    ) return !0

    // Obtener settings del bot correctamente desde conn.user.jid
    const bot = global.db.data.settings?.[conn.user.jid] || {}

    console.log('\n========== ANTI PRIVATE ==========')
    console.log('Sender:', m.sender)
    console.log('Chat:', m.chat)
    console.log('Text:', text)
    console.log('antiPrivate:', bot.antiPrivate)
    console.log('isOwner:', isOwner)
    console.log('isROwner:', isROwner)
    console.log('conn.user.jid:', conn.user?.jid)

    // Si antiPrivate está activo y no es owner/real owner
    if (bot.antiPrivate && !isOwner && !isROwner) {
      console.log('[ANTI-PRIVATE] antiPrivate activo, enviando aviso...')

      await m.reply(
        `> 🍧 Hola @${m.sender.split('@')[0]}, lo siento, no está permitido escribirme al privado, por lo cual serás bloqueado/a.\n\n> Puedes unirte al grupo oficial del bot para su funcionamiento o cualquier consulta 👇\n\n${gp1}`,
        false,
        { mentions: [m.sender] }
      )

      console.log('[ANTI-PRIVATE] Aviso enviado correctamente.')
      console.log('[ANTI-PRIVATE] Esperando 3 segundos antes de bloquear...')

      // Pequeña espera para que el mensaje se alcance a enviar
      await new Promise(resolve => setTimeout(resolve, 3000))

      console.log('[ANTI-PRIVATE] Intentando bloquear a:', m.sender)

      const res = await conn.updateBlockStatus(m.sender, 'block')

      console.log('[ANTI-PRIVATE] Resultado del bloqueo:', res)
      console.log('[ANTI-PRIVATE] Usuario bloqueado correctamente:', m.sender)
    } else {
      console.log('[ANTI-PRIVATE] No se bloqueó.')
      console.log('Motivo:')
      console.log('- antiPrivate:', bot.antiPrivate)
      console.log('- isOwner:', isOwner)
      console.log('- isROwner:', isROwner)
    }

    console.log('==================================\n')
    return !1
  } catch (e) {
    console.error('\n❌ ERROR EN ANTI-PRIVATE ❌')
    console.error(e)
    console.error('Stack:', e?.stack || 'Sin stack')
    console.error('============================\n')
    return !1
  }
}
