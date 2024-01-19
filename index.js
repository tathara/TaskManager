import TelegramBot from 'node-telegram-bot-api';
import { authOptions } from './bot/bot.options.js';
import UserController from './user/user.controller.js';
import BotSender from './bot/bot.sender.js';
import BotProcessor from './bot/bot.processor.js';

let userController, botSender, botProcessor;

const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegramToken, { polling: true });


bot.setMyCommands([
    { command: '/start', description: 'Аутентификация' },
]);

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.chat.first_name;

    if (text === '/start' && userController) {
        await bot.sendMessage(chatId, `👀 ${userName}, ты уже авторизован!`)
        return botSender.sendMainMenu(chatId);
    }
    else if (text === '/start' && !userController) {
        await bot.sendMessage(chatId, `✅ Привет, ${userName}!`);

        return bot.sendMessage(chatId, `😎 Я помогу тебе разобраться с управлением над командными задачами, но для начала тебе предстоит пройти аутентификацию!`, authOptions);
    }
    else if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            userController = new UserController(data);
            botSender = new BotSender(bot, userController);
            botProcessor = new BotProcessor(bot, userController, botSender);

            if (userController) {
                await bot.sendMessage(chatId, `✅ Аутентификация успешно пройдена!`);

                return botSender.sendMainMenu(chatId);
            }
        }
        catch (error) {
            return bot.sendMessage(chatId, '⛔️ Произошла ошибка аутентификации!');
        }
    }
    else {
        return bot.sendMessage(chatId, `⛔️ Я не понимаю о чем ты!`);
    }
});

bot.on('callback_query', async msg => {
    try {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        await botProcessor.processCallback(data, chatId);
    }
    catch (error) {
        return bot.sendMessage(chatId, '⛔️ Произошла ошибка обработки запроса!');
    }
});