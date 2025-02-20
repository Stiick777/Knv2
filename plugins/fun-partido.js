import fs from 'fs';
import similarity from 'similarity';

const equipos = [
    // Europa
    'Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool', 'PSG', 'Bayern Múnich',
    'Juventus', 'Chelsea', 'Inter de Milán', 'AC Milan', 'Arsenal', 'Atlético de Madrid',
    'Borussia Dortmund', 'Tottenham', 'Napoli', 'Roma', 'Sevilla', 'Lazio', 'Ajax', 'Benfica',
    'Porto', 'Sporting Lisboa', 'Shakhtar Donetsk', 'Zenit', 'Celtic', 'Rangers', 
    'Galatasaray', 'Fenerbahçe', 'Olympique de Marsella', 'Lyon', 'Red Bull Salzburg', 
    'RB Leipzig', 'Newcastle United', 'Aston Villa', 'Everton', 'Leicester City', 
    'West Ham United', 'Villarreal', 'Real Sociedad', 'Braga', 'PSV Eindhoven', 
    'Feyenoord', 'Anderlecht', 'Club Brugge', 'Besiktas', 'Dynamo Kiev', 'Spartak Moscú',
    'CSKA Moscú', 'Bayer Leverkusen', 'Wolfsburgo', 'Eintracht Frankfurt', 'Lille', 
    'Monaco', 'Nice', 'Stuttgart', 'Schalke 04', 'Valencia', 'Real Betis', 'Athletic Bilbao', 
    'Fiorentina', 'Torino', 'Atalanta', 'Bordeaux', 'Olympiacos', 'PAOK', 'Genk', 'Standard Lieja',
    
    // América
    'Boca Juniors', 'River Plate', 'Flamengo', 'Palmeiras', 'Santos', 'Corinthians', 
    'São Paulo', 'Gremio', 'Tigres UANL', 'Monterrey', 'América', 'Cruz Azul', 
    'Pumas UNAM', 'Chivas', 'Colo Colo', 'Universidad de Chile', 'Universitario', 
    'Alianza Lima', 'Emelec', 'Barcelona SC', 'Liga de Quito', 'Deportivo Cali', 
    'Atlético Nacional', 'Millonarios', 'Independiente Medellín', 'Cerro Porteño', 
    'Olimpia', 'Bolívar', 'The Strongest', 'Peñarol', 'Nacional de Uruguay', 
    'Defensa y Justicia', 'Racing Club', 'Independiente', 'San Lorenzo', 
    'Internacional de Porto Alegre', 'Fortaleza', 'Atlético Mineiro', 'Fluminense',

    // África
    'Al Ahly', 'Zamalek', 'Raja Casablanca', 'Wydad Casablanca', 'Espérance de Tunis',
    'Étoile du Sahel', 'Orlando Pirates', 'Kaizer Chiefs', 'Mamelodi Sundowns', 
    'TP Mazembe', 'AS Vita Club', 'Al Hilal Omdurman',

    // Asia
    'Al Hilal', 'Al Nassr', 'Persepolis', 'Esteghlal', 'Al Sadd', 'Al Duhail', 
    'Urawa Red Diamonds', 'Kashima Antlers', 'Yokohama F. Marinos', 'Guangzhou Evergrande',
    'Shanghai Port', 'Jeonbuk Hyundai Motors', 'Suwon Bluewings', 'FC Seoul',

    // Oceanía
    'Auckland City', 'Sydney FC', 'Melbourne Victory', 'Wellington Phoenix',

    // MLS y Concacaf
    'LA Galaxy', 'Los Angeles FC', 'New York City FC', 'New York Red Bulls', 'Seattle Sounders',
    'Atlanta United', 'Inter Miami', 'Toronto FC', 'Club León', 'Toluca', 'Saprissa',
    'Herediano', 'Motagua', 'Olimpia', 'Real España',

    // Clubes históricos o en ascenso
    'Nottingham Forest', 'Sheffield United', 'Leeds United', 'Blackburn Rovers',
    'Derby County', 'Parma', 'Red Star Belgrade', 'Steaua Bucarest', 'Maribor', 'Basel'
];

const partidos = {}; // Almacena los partidos en curso por usuario
const ultimoPartido = {}; // Almacena el tiempo del último partido por usuario
const timeout = 300000; // 5 minutos (300,000 ms)
const limiteDiario = 86400000; // 24 horas (86,400,000 ms)
const XP_Acierto = 20000;
const XP_Cercano = 5000;
const umbralSimilitud = 0.8;

let handler = async (m, { conn, args, command }) => {
    const id = m.sender; // Ahora cada usuario tiene su propio partido
    const ahora = Date.now();

    if (command === 'partido') {
        if (id in partidos) {
            return conn.reply(m.chat, '⚠️ Ya tienes un partido en curso. Espera a que termine.', m);
        }

        if (ultimoPartido[id] && ahora - ultimoPartido[id] < limiteDiario) {
            let tiempoRestante = limiteDiario - (ahora - ultimoPartido[id]);
            let horas = Math.floor(tiempoRestante / 3600000);
            let minutos = Math.floor((tiempoRestante % 3600000) / 60000);
            let segundos = Math.floor((tiempoRestante % 60000) / 1000);

            return conn.reply(m.chat, `⚠️ Ya generaste un partido hoy. Vuelve en *${horas}h ${minutos}m ${segundos}s*`, m);
        }

        let equipo1 = equipos[Math.floor(Math.random() * equipos.length)];
        let equipo2;
        do {
            equipo2 = equipos[Math.floor(Math.random() * equipos.length)];
        } while (equipo1 === equipo2);

        partidos[id] = { equipo1, equipo2, marcador1: null, marcador2: null };
        ultimoPartido[id] = ahora; // Guarda la fecha de generación del partido

        conn.reply(m.chat, `⚽ *¡Nuevo Partido para ${m.pushName}!*\n🥅 Equipos:\n *${equipo1} vs ${equipo2}*\n\n🔹 Escribe: \`/voto <tu equipo>\`\n🔹 Ejemplo: \`/voto ${equipo1}\``, m);
        return;
    }

    if (command === 'voto') {
        if (!(id in partidos)) return conn.reply(m.chat, '⚠️ No tienes un partido en curso. Usa `/partido` para iniciar uno.', m);
        if (!args[0]) return conn.reply(m.chat, '❌ Debes elegir un equipo. Ejemplo: `/voto <equipo>`', m);

        let { equipo1, equipo2 } = partidos[id];
        let equipoSeleccionado = args.join(' ');

        if (![equipo1.toLowerCase(), equipo2.toLowerCase()].includes(equipoSeleccionado.toLowerCase())) {
            return conn.reply(m.chat, `⚠️ Elige un equipo válido: *${equipo1}* o *${equipo2}*`, m);
        }

       let user = global.db.data.users[m.sender];

if (!user) return conn.reply(m.chat, '❌ No tienes suficiente XP para apostar.', m);

if (user.exp < 1000) {
    return conn.reply(m.chat, '❌ No tienes suficiente XP para apostar. Necesitas al menos *1000 XP*.', m);
}

user.exp -= 1000; // Restar XP correctamente

partidos[id].equipoUsuario = equipo1.toLowerCase() === equipoSeleccionado.toLowerCase() ? equipo1 : equipo2;

conn.reply(m.chat, `✅ Apostaste *1000 XP* y elegiste *${partidos[id].equipoUsuario}*.\n🔹 Ahora usa: \`/marcador <goles de ${partidos[id].equipoUsuario}> <goles del rival>\`\n🔹 Ejemplo: \`/marcador 3 1\``, m);
return;

    }

    if (command === 'delp') {
        if (!(id in partidos)) {
            return conn.reply(m.chat, '⚠️ No tienes un partido en curso para eliminar.', m);
        }

        delete partidos[id];
        conn.reply(m.chat, '⚠️ Tu partido ha sido eliminado. No podrás generar otro hasta mañana.', m);
        return;
    }

    if (command === 'marcador') {
        if (!(id in partidos)) return conn.reply(m.chat, '⚠️ No tienes un partido en curso. Usa `/partido` para generar uno.', m);
        if (!args[0] || !args[1] || isNaN(args[0]) || isNaN(args[1])) {
            return conn.reply(m.chat, '❌ Debes escribir dos números. Ejemplo: `/marcador 2 1`', m);
        }

        let marcador1 = parseInt(args[0]);
        let marcador2 = parseInt(args[1]);

        let { equipo1, equipo2, equipoUsuario } = partidos[id];
        let equipoRival = equipoUsuario === equipo1 ? equipo2 : equipo1;

        partidos[id].marcador1 = marcador1;
        partidos[id].marcador2 = marcador2;

        conn.reply(m.chat, `🕒 *Partido en curso...* 🏆\n🔹 *${equipo1} vs ${equipo2}*\n📢 *Resultado final en 5 minutos...*`, m);

        setTimeout(() => {
            let marcadorReal1 = Math.floor(Math.random() * 5);
            let marcadorReal2 = Math.floor(Math.random() * 5);

            let mensajeResultado = `
🏆 Resultado Oficial: ⚽ ${equipo1} ${marcadorReal1} - ${marcadorReal2} ${equipo2}

🔹 Tu predicción: ${equipoUsuario} ${marcador1} - ${marcador2} ${equipoRival}`;

            let xpGanado = 0;
            if (marcador1 === marcadorReal1 && marcador2 === marcadorReal2) {
                xpGanado = XP_Acierto;
                mensajeResultado += `\n🎉 ¡Increíble! Acertaste exactamente el marcador. Ganaste *+${XP_Acierto} XP* 🎊`;
            } else if (similarity(`${marcador1}-${marcador2}`, `${marcadorReal1}-${marcadorReal2}`) >= umbralSimilitud) {
                xpGanado = XP_Cercano;
                mensajeResultado += `\n👍 Estuviste cerca. Ganaste *+${XP_Cercano} XP* 👏`;
            } else {
                mensajeResultado += `\n❌ No acertaste. ¡Sigue intentando!`;
            }

            global.db.data.users[m.sender].exp += xpGanado;
            conn.reply(m.chat, mensajeResultado, m);

            delete partidos[id];
        }, timeout);
    }
};

handler.help = ['partido', 'delp'];
handler.tags = ['fun'];
handler.command = ['partido', 'voto', 'marcador', 'delp'];
handler.group = true

export default handler;