import { Client, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from '@discordjs/voice';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates, // Ses kanalları için gerekli intent
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  rest: {
    api: 'https://micup.gg/api',
    cdn: 'https://media.micup.gg',
    mediaProxy: 'https://media.micup.gg',
  },
});

// Belirttiğin ses kanalının ID'si
const VOICE_CHANNEL_ID = '1570094874966360066';

client.once('ready', async () => {
  console.log(`Bot aktif! Giriş yapıldı: ${client.user.tag}`);

  // Botun bağlı olduğu sunucuyu bul ve ses kanalına bağlan
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.log('Sunucu bulunamadı!');
    return;
  }

  connectToVoice(guild);
});

async function connectToVoice(guild) {
  try {
    const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);
    if (!channel) {
      console.log('Belirtilen ses kanalı bulunamadı!');
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: true // Odada sessizde durması için
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log(`Başarıyla ${channel.name} ses kanalına girildi ve 7/24 aktif!`);
    });

    // Bağlantı koparsa otomatik yeniden bağlan
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await entersState(connection, VoiceConnectionStatus.Signalling, 5_000);
        await entersState(connection, VoiceConnectionStatus.Connecting, 5_000);
      } catch (error) {
        console.log('Ses bağlantısı koptu, yeniden bağlanılıyor...');
        connection.destroy();
        setTimeout(() => connectToVoice(guild), 5000);
      }
    });

  } catch (error) {
    console.error('Ses kanalına bağlanırken hata oluştu:', error);
  }
}

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.reply('Pong! 🏓 7/24 sesteyim!');
  }

  if (message.content.toLowerCase() === '!sa') {
    message.reply('Aleykümselam, ses kanalındayım! 👋');
  }

  if (message.content === '!yardım') {
    message.reply('Kullanabileceğin komutlar:\n- `!ping`: Gecikmeyi test eder.\n- `!sa`: Selam verir.');
  }
});

client.login(process.env.MICUP_TOKEN || 'MTU2ODczMDUwNTkwOTExMjgzMg.MTc5NDQxMjc2OQ.t1nkZkAeTvO-Eiq7EbrHzuUttMF9UGwhm2y9XFbFnuw');