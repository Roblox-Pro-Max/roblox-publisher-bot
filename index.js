const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8781043972:AAHQPZe6UZgGUCF3kVEbyOVBmPnTkpGeDKE';
const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY || 'VnP4J/CyoUmd7Hkp92Z1MnTqvalKkipySOoyW2r0NwQxRkTMZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWxadVVEUktMME41YjFWdFpEZElhM0E1TWxveFRXNVVjWFpoYkV0cmFYQjVVMDl2ZVZjeWNqQk9kMUY0VW10VVRTSXNJbTkzYm1WeVNXUWlPaUl4TURReU9UY3pNakl4TlNJc0ltVjRjQ0k2TVRjM056QTFPRFF4TlN3aWFXRjBJam94TnpjM01EVTBPREUxTENKdVltWWlPakUzTnpjd05UUTRNVFY5LkhITHg4bDN1VUxVbjZSZ2lTMDZsblFJX3d1NnAyTm5IYS1TU2J1S1lmd0owMUxHaVF5VnNJeTFPSDJrQmpMcmtTanNKbnNfaWVzTXNVTVJTZlZ0akRXRHItWkI5SldPamVYdlZyY1RtYTJxejM5MmVEdUdUbWYxZmo5Z1JwaDQ2ZHBwNmJ4V0ptQ2NyZ0YzRVZ1M3NycUZIZVNpTGEtLXZyMlVSVmh5emVNVnI2OUZ1SURXNFJ2elgwNG1Oc000bnYwV3NCSVRyTUJMTG1KMkpza2RZVkxUWUJkY3Rjd1NkcnBIYl9IZG1wRDRJVG96eHBnQ2xZdmwtRlpVTHpBMnVsMnZCd0sxOG1uSDVIUXFDZ2huWGFhTjhOU2N5c0FDMndoVk42ZG1FSFlSRDR0aUd1S2owUU80ZGlMaVByN3VrNmdpN2cyYXRVYlBTUkk4SXZhWXctZw==';
const PLACE_ID = '126680495098774';
const UNIVERSE_ID = process.env.UNIVERSE_ID || '9645120373';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log('🤖 Roblox Publisher Bot işləyir...');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    '👋 Salam! Mən Roblox Publisher Botam!\n\n' +
    '📁 Mənə .rbxl və ya .rbxm faylı göndər\n' +
    '🚀 Mən onu avtomatik Roblox-a publish edəcəyəm!\n\n' +
    '⚙️ Komandalar:\n' +
    '/start - Botu başlat\n' +
    '/status - Bot statusunu yoxla\n' +
    '/help - Kömək'
  );
});

bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    '📊 Bot Status:\n\n' +
    '✅ Telegram: Aktiv\n' +
    '✅ Roblox API Key: Var\n' +
    `✅ Universe ID: ${UNIVERSE_ID}\n` +
    `✅ Place ID: ${PLACE_ID}`
  );
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    '📖 Necə istifadə etməli:\n\n' +
    '1️⃣ .rbxl və ya .rbxm faylını göndər\n' +
    '2️⃣ Bot avtomatik Roblox-a yükləyəcək\n' +
    '3️⃣ Publish tamamlandıqda bildiriş alacaqsan\n\n' +
    '⚠️ Qeyd: Fayl ölçüsü 50MB-dan az olmalıdır'
  );
});

bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  const document = msg.document;
  const fileName = document.file_name || '';

  if (!fileName.endsWith('.rbxl') && !fileName.endsWith('.rbxm')) {
    bot.sendMessage(chatId, '❌ Yalnız .rbxl və ya .rbxm faylları qəbul edilir!');
    return;
  }

  try {
    await bot.sendMessage(chatId, '⏳ Fayl qəbul edildi, yüklənir...');

    const fileLink = await bot.getFileLink(document.file_id);
    const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(response.data);

    await bot.sendMessage(chatId, '🚀 Roblox-a göndərilir...');

    const publishResponse = await axios.post(
      `https://apis.roblox.com/universes/v1/${UNIVERSE_ID}/places/${PLACE_ID}/versions`,
      fileBuffer,
      {
        headers: {
          'x-api-key': ROBLOX_API_KEY,
          'Content-Type': 'application/octet-stream',
        },
        params: {
          versionType: 'Published'
        }
      }
    );

    if (publishResponse.status === 200) {
      const versionNumber = publishResponse.data?.versionNumber || 'N/A';
      await bot.sendMessage(chatId,
        '✅ Uğurla publish edildi!\n\n' +
        `📦 Fayl: ${fileName}\n` +
        `🔢 Versiya: ${versionNumber}\n` +
        `🎮 Oyun: roblox.com/games/${PLACE_ID}\n\n` +
        '🎉 Oyunun Roblox-da yeniləndi!'
      );
    }

  } catch (error) {
    console.error('Xəta:', error.response?.data || error.message);

    let errorMsg = '❌ Xəta baş verdi!\n\n';

    if (error.response?.status === 401) {
      errorMsg += '🔑 API Key yanlışdır.';
    } else if (error.response?.status === 403) {
      errorMsg += '🚫 İcazə yoxdur. API Key-in publish icazəsi olmalıdır.';
    } else if (error.response?.status === 404) {
      errorMsg += '🔍 Universe ID və ya Place ID yanlışdır.';
    } else {
      errorMsg += `Xəta: ${error.response?.data?.message || error.message}`;
    }

    await bot.sendMessage(chatId, errorMsg);
  }
});

bot.on('message', (msg) => {
  if (msg.document) return;
  if (msg.text && msg.text.startsWith('/')) return;
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '📁 Mənə .rbxl və ya .rbxm faylı göndər!');
});
                                     
