function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function normalizeNumber(jid = '') {
  return jid.split('@')[0].replace(/[^\d]/g, '')
}

function buildCandidateJids(inputJid, blocklist = []) {
  const num = normalizeNumber(inputJid)
  const candidates = new Set()

  // PN normal
  if (num) candidates.add(`${num}@s.whatsapp.net`)

  // Si el input ya viene con otro dominio, también lo guardamos
  if (inputJid) candidates.add(inputJid)

  // Buscar posibles LID del mismo número dentro de blocklist
  for (const jid of blocklist || []) {
    const jidNum = normalizeNumber(jid)
    if (jidNum === num) candidates.add(jid)
  }

  return [...candidates]
}

async function getBlocklistSafe(conn) {
  try {
    if (typeof conn.fetchBlocklist === 'function') {
      const list = await conn.fetchBlocklist()
      return Array.isArray(list) ? list : []
    }
  } catch (e) {
    console.log('[BLOCK] Error obteniendo blocklist:', e?.message || e)
  }
  return []
}

async function tryBlock(conn, jid) {
  // Método 1
  if (typeof conn.updateBlockStatus === 'function') {
    try {
      console.log(`[BLOCK] updateBlockStatus -> ${jid}`)
      const res = await Promise.race([
        conn.updateBlockStatus(jid, 'block'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout updateBlockStatus: ${jid}`)), 8000)
        )
      ])
      return { ok: true, method: 'updateBlockStatus', jid, result: res }
    } catch (e) {
      console.log(`[BLOCK] updateBlockStatus FALLÓ para ${jid}:`, e?.message || e)
    }
  }

  // Método 2
  if (typeof conn.query === 'function') {
    try {
      console.log(`[BLOCK] query blocklist -> ${jid}`)
      const res = await Promise.race([
        conn.query({
          tag: 'iq',
          attrs: {
            xmlns: 'blocklist',
            to: '@s.whatsapp.net',
            type: 'set'
          },
          content: [{
            tag: 'item',
            attrs: {
              action: 'block',
              jid
            }
          }]
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout query blocklist: ${jid}`)), 8000)
        )
      ])
      return { ok: true, method: 'query-blocklist', jid, result: res }
    } catch (e) {
      console.log(`[BLOCK] query blocklist FALLÓ para ${jid}:`, e?.message || e)
    }
  }

  return { ok: false, jid }
}

async function blockUser(conn, senderJid) {
  console.log('\n[BLOCK] ===== INICIO BLOQUEO =====')
  console.log('[BLOCK] sender original:', senderJid)

  const blocklistBefore = await getBlocklistSafe(conn)
  console.log('[BLOCK] blocklist antes:', blocklistBefore)

  const candidates = buildCandidateJids(senderJid, blocklistBefore)

  console.log('[BLOCK] candidatos a bloquear:', candidates)

  // Probar cada candidato
  for (const jid of candidates) {
    const attempt = await tryBlock(conn, jid)
    if (attempt.ok) {
      console.log('[BLOCK] intento exitoso:', attempt)

      // Revalidar blocklist
      const blocklistAfter = await getBlocklistSafe(conn)
      console.log('[BLOCK] blocklist después:', blocklistAfter)

      if (blocklistAfter.includes(jid)) {
        console.log('[BLOCK] usuario confirmado en blocklist:', jid)
        console.log('[BLOCK] ===== FIN BLOQUEO =====\n')
        return { ok: true, ...attempt, verified: true }
      }

      // Si no aparece, igual devolvemos el intento exitoso
      console.log('[BLOCK] no se pudo verificar en blocklist, pero el método respondió OK')
      console.log('[BLOCK] ===== FIN BLOQUEO =====\n')
      return { ok: true, ...attempt, verified: false }
    }
  }

  console.log('[BLOCK] No se pudo bloquear con ningún candidato.')
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
      const sender = (m.sender || m.chat || '').trim()

      await m.reply(
        `> 🍧 Hola @${sender.split('@')[0]}, lo siento, no está permitido escribirme al privado, por lo cual serás bloqueado/a.\n\n> Puedes unirte al grupo oficial del bot para su funcionamiento o cualquier consulta 👇\n\n${gp1}`,
        false,
        { mentions: [sender] }
      )

      console.log('[ANTI-PRIVATE] Aviso enviado correctamente.')
      console.log('[ANTI-PRIVATE] Esperando 3 segundos antes de bloquear...')
      await delay(3000)

      const blocked = await blockUser(conn, sender)

      console.log('[ANTI-PRIVATE] Resultado final:', blocked)

      if (!blocked.ok) {
        console.log('[ANTI-PRIVATE] No se logró bloquear al usuario:', sender)
      } else {
        console.log(`[ANTI-PRIVATE] Usuario bloqueado con método: ${blocked.method}`)
        console.log(`[ANTI-PRIVATE] JID bloqueado: ${blocked.jid}`)
      }
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
