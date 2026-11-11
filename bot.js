import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  rest: {
    api: 'https://micup.gg/api',
    cdn: 'https://media.micup.gg',
    mediaProxy: 'https://media.micup.gg',
  },
});

client.on('ready', () => {
  console.log(`Bot aktif! Giriş yapıldı: ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  // Botların kendi kendine yanıt vermesini (döngüyü) engeller
  if (message.author.bot) return;

  // !ping komutu
  if (message.content === '!ping') {
    message.reply('Pong!');
  }

  // !sa komutu (büyük/küçük harf duyarsız çalışır)
  if (message.content.toLowerCase() === '!sa') {
    message.reply('Aleykümselam, hoş geldin! 👋');
  }

  // !yardım komutu
  if (message.content === '!yardım') {
    message.reply('Kullanabileceğin komutlar:\n- `!ping`: Gecikmeyi test eder.\n- `!sa`: Selam verir.\n- `!yardım`: Yardım menüsünü gösterir.');
  }
});

// Yeni token ile güncellendi
client.login(process.env.MICUP_TOKEN || 'MTU2ODczMDUwNTkwOTExMjgzMg.MTc5NDQxMDI4Mg.mbWwkkgJaXL6SAIo_zzI_6YoFCowASN86Kp-vobJNhA');