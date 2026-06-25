function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function before(m, { conn, isOwner, isROwner }) {
  try {
    if (m.isBaileys && m.fromMe) return !0
    if (m.isGroup) return !1
    if (!m.message) return !0

    const text = m.text || ''

    if (
      text.includes('PIEDRA') ||
      text.includes('PAPEL') ||
      text.includes('TIJERA') ||
      text.includes('jad code') ||
      text.includes('code') ||
      text.includes('serbot') ||
      text.includes('jadibot')
    ) return !0

    const bot = global.db.data.settings?.[conn.user.jid] || {}

    console.log('\n========== ANTI PRIVATE ==========')
    console.log('Sender:', m.sender)
    console.log('Chat:', m.chat)
    console.log('Text:', text)
    console.log('antiPrivate:', bot.antiPrivate)
    console.log('isOwner:', isOwner)
    console.log('isROwner:', isROwner)
    console.log('conn.user.jid:', conn.user?.jid)
    console.log('typeof conn.updateBlockStatus:', typeof conn.updateBlockStatus)

    if (bot.antiPrivate && !isOwner && !isROwner) {
      const jid = (m.sender || m.chat || '').trim()

      console.log('[ANTI-PRIVATE] JID a bloquear:', jid)

      await m.reply(
        `> 🍧 Hola @${jid.split('@')[0]}, lo siento, no está permitido escribirme al privado, por lo cual serás bloqueado/a.\n\n> Puedes unirte al grupo oficial del bot para su funcionamiento o cualquier consulta 👇\n\n${gp1}`,
        false,
        { mentions: [jid] }
      )

      console.log('[ANTI-PRIVATE] Aviso enviado correctamente.')
      console.log('[ANTI-PRIVATE] Esperando 3 segundos antes de bloquear...')
      await delay(3000)

      // Verifica si el método existe
      if (typeof conn.updateBlockStatus !== 'function') {
        console.log('[ANTI-PRIVATE] ERROR: conn.updateBlockStatus no existe.')
        return !1
      }

      console.log('[ANTI-PRIVATE] Intentando bloquear a:', jid)

      try {
        const result = await Promise.race([
          conn.updateBlockStatus(jid, 'block'),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout en updateBlockStatus (10s)')), 10000)
          )
        ])

        console.log('[ANTI-PRIVATE] Resultado del bloqueo:', result)
        console.log('[ANTI-PRIVATE] Usuario bloqueado correctamente:', jid)
      } catch (blockErr) {
        console.log('[ANTI-PRIVATE] ERROR AL BLOQUEAR:')
        console.log(blockErr)
        console.log('Mensaje:', blockErr?.message)
        console.log('Stack:', blockErr?.stack)
      }
    } else {
      console.log('[ANTI-PRIVATE] No se bloqueó.')
      console.log('Motivo -> antiPrivate:', bot.antiPrivate, '| isOwner:', isOwner, '| isROwner:', isROwner)
    }

    console.log('==================================\n')
    return !1
  } catch (e) {
    console.error('\n❌ ERROR EN ANTI-PRIVATE ❌')
    console.error(e)
    console.error('Mensaje:', e?.message)
    console.error('Stack:', e?.stack)
    console.error('============================\n')
    return !1
  }
          }
