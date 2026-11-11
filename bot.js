import { Client, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from '@discordjs/voice';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  rest: {
    api: 'https://micup.gg/api',
    cdn: 'https://media.micup.gg',
    mediaProxy: 'https://media.micup.gg',
  },
  // Micup gateway bağlantısı için özel ws ayarı
  ws: {
    gateway: {
      url: 'wss://gateway.micup.gg'
    }
  }
});

const VOICE_CHANNEL_ID = '1570094874966360066';

client.once('ready', async () => {
  console.log(`Micup Bot aktif! Giriş yapıldı: ${client.user.tag}`);

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
      selfMute: true
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log(`Başarıyla ${channel.name} ses kanalına giriş yapıldı!`);
    });

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

client.login(process.env.MICUP_TOKEN);