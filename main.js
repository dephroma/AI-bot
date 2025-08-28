const { Telegraf } = require('telegraf');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const bot = new Telegraf(BOT_TOKEN);

// Обработчик команды /start
bot.start((ctx) => {
  ctx.reply(
    '🤖 Привет! Я бот с интеграцией DeepSeek AI.\n\n' +
    'Просто напиши мне любой запрос или вопрос, и я отправлю его нейросети для генерации ответа!'
  );
});

// Обработчик текстовых сообщений
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  
  try {
    // Отправляем запрос в DeepSeek API
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: userMessage }],
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Отправляем ответ пользователю
    const aiResponse = response.data.choices[0].message.content;
    await ctx.reply(aiResponse);
    
  } catch (error) {
    console.error('Ошибка:', error.response?.data || error.message);
    ctx.reply('⚠️ Произошла ошибка при обработке запроса. Попробуйте позже.');
  }
});

// Запуск бота
bot.launch().then(() => {
  console.log('Бот запущен!');
});

// Включите graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));