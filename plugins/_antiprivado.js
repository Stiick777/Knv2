function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function blockUser(conn, jid) {
  console.log('\n[BLOCK] ===== INICIO BLOQUEO =====')
  console.log('[BLOCK] JID:', jid)
  console.log('[BLOCK] typeof conn.updateBlockStatus:', typeof conn.updateBlockStatus)
  console.log('[BLOCK] typeof conn.fetchBlocklist:', typeof conn.fetchBlocklist)

  // MÉTODO 1: updateBlockStatus normal
  if (typeof conn.updateBlockStatus === 'function') {
    try {
      console.log('[BLOCK] Probando método 1: conn.updateBlockStatus(...)')

      const res = await Promise.race([
        conn.updateBlockStatus(jid, 'block'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout en updateBlockStatus (8s)')), 8000)
        )
      ])

      console.log('[BLOCK] Método 1 OK:', res)
      return { ok: true, method: 'updateBlockStatus', result: res }
    } catch (e) {
      console.log('[BLOCK] Método 1 FALLÓ')
      console.log('[BLOCK] Error:', e?.message || e)
    }
  }

  // MÉTODO 2: verificar si ya quedó en blocklist
  if (typeof conn.fetchBlocklist === 'function') {
    try {
      console.log('[BLOCK] Consultando blocklist...')
      const beforeList = await conn.fetchBlocklist()
      console.log('[BLOCK] Blocklist actual:', beforeList)

      if (Array.isArray(beforeList) && beforeList.includes(jid)) {
        console.log('[BLOCK] El usuario ya estaba bloqueado.')
        return { ok: true, method: 'already_blocked', result: beforeList }
      }
    } catch (e) {
      console.log('[BLOCK] Error consultando blocklist:', e?.message || e)
    }
  }

  // MÉTODO 3: intento alterno con query directa (fallback Baileys)
  try {
    console.log('[BLOCK] Probando método 2: query directa a blocklist...')

    if (typeof conn.query === 'function') {
      const result = await Promise.race([
        conn.query({
          tag: 'iq',
          attrs: {
            xmlns: 'blocklist',
            to: '@s.whatsapp.net',
            type: 'set'
          },
          content: [
            {
              tag: 'item',
              attrs: {
                action: 'block',
                jid
              }
            }
          ]
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout en query blocklist (8s)')), 8000)
        )
      ])

      console.log('[BLOCK] Método 2 OK:', result)
      return { ok: true, method: 'query-blocklist', result }
    } else {
      console.log('[BLOCK] conn.query no existe')
    }
  } catch (e) {
    console.log('[BLOCK] Método 2 FALLÓ')
    console.log('[BLOCK] Error:', e?.message || e)
  }

  // MÉTODO 4: revalidar blocklist por si el bloqueo sí entró pero no respondió
  if (typeof conn.fetchBlocklist === 'function') {
    try {
      console.log('[BLOCK] Revalidando blocklist...')
      const afterList = await conn.fetchBlocklist()
      console.log('[BLOCK] Blocklist final:', afterList)

      if (Array.isArray(afterList) && afterList.includes(jid)) {
        console.log('[BLOCK] Usuario sí quedó bloqueado tras fallback.')
        return { ok: true, method: 'verified_in_blocklist', result: afterList }
      }
    } catch (e) {
      console.log('[BLOCK] Error revalidando blocklist:', e?.message || e)
    }
  }

  console.log('[BLOCK] No se pudo bloquear al usuario.')
  console.log('[BLOCK] ===== FIN BLOQUEO =====\n')
  return { ok: false, method: null, result: null }
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

      const blocked = await blockUser(conn, jid)

      console.log('[ANTI-PRIVATE] Resultado final:', blocked)

      if (!blocked.ok) {
        console.log('[ANTI-PRIVATE] No se logró bloquear al usuario:', jid)
      } else {
        console.log(`[ANTI-PRIVATE] Usuario bloqueado con método: ${blocked.method}`)
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
