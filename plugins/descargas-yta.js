import fetch from "node-fetch";
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) {
      throw new Error('Formato de audio no soportado.');
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };

    try {
      const response = await axios.request(config);
      if (response.data && response.data.success) {
        const { id } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { downloadUrl };
      } else {
        throw new Error('No se pudo obtener el enlace de descarga.');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};

const handler = async (m, { conn, text }) => {
  try {
    if (!text || !isValidYouTubeUrl(text)) {
      return conn.reply(m.chat, '⚠️ Proporciona un *enlace válido de YouTube*.', m);
    }

    // Reacción inicial de espera ⏳
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const { downloadUrl } = await ddownr.download(text, 'mp3');

    // Reacción de éxito ✅
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m });

  } catch (error) {
    // Reacción de error (opcional)
    // await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

    return m.reply(`⚠️ Error: ${error.message}`);
  }
};

handler.command = ['ytmp3', 'yta'];
handler.help = ['ytmp3 <url>'];
handler.tags = ['descargas'];
handler.group = true

export default handler;

function isValidYouTubeUrl(url) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
  return regex.test(url.trim());
}