import TelegramBot from 'node-telegram-bot-api';
import config from 'config';
import { CommonUser, RootUser } from './users.js';

const telegramToken = config.get('TELEGRAM_TOKEN');
const bot = new TelegramBot(telegramToken, { polling: true });
const user = new CommonUser('Artur', 'Back-end');

const botOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'ℹ️ Все задачи', callback_data: 'tasks' }, { text: 'ℹ️ Мои задачи', callback_data: 'thisTasks' }],
            [{ text: '✅Взять задачу', callback_data: 'take' }, { text: '❌ Отклонить задачу', callback_data: 'reject' }],
            [{ text: '❕ Утвердить задачу', callback_data: 'commit' }, { text: '❗️ Отправить задачу на доработку', callback_data: 'uncommit' }],
        ]
    })
};

bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
]);

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.chat.first_name;

    if (text === '/start') return bot.sendMessage(chatId, `✅ Привет, ${userName}! Я помогу вам разобраться с управлением над командными задачами.`, botOptions);
    return bot.sendMessage(chatId, `⛔️ Я не понимаю о чем ты, попробуй что-нибудь другое!`, botOptions);
});

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    processCallback(data, chatId)
});

function fillKeys(tasks, action) {
    return Object.keys(tasks).map(key => [{ text: key, callback_data: `${action}_${key}` }]);
}

function makeMarkup(tasks, action) {
    const markup = {
        reply_markup: JSON.stringify({
            inline_keyboard: fillKeys(tasks, action),
        })
    }

    return markup;
}

async function processAction(action, chatId) {
    const tasks = action === 'take' ? user.getAllTasks() : user.getThisTasks();
    const tasksOptions = makeMarkup(tasks, action);

    await bot.sendMessage(chatId, 'Выберите номер задачи', tasksOptions);
}

async function processCallback(data, chatId) {
    switch (data) {
        case 'tasks':
            const tasks = user.getAllTasksString();
            return await bot.sendMessage(chatId, tasks);

        case 'thisTasks':
            const thisTasks = user.getThisTasksString();
            return await bot.sendMessage(chatId, thisTasks);

        case 'take':
            return await processAction('take', chatId);

        case 'reject':
            await processAction('reject', chatId);
            return;

        case 'commit':
            await processAction('commit', chatId);
            return;

        case 'uncommit':
            await processAction('uncommit', chatId);
            return;

        default:
            await processInput(data, chatId);
    }
}

async function processInput(input, chatId) {
    const action = input.split('_');
    const taskId = action[1];

    switch (action[0]) {
        case 'take':
            user.takeTask(taskId);
            return await bot.sendMessage(chatId, `✅ Вы взяли задачу №${taskId}`);

        case 'reject':
            user.rejectTask(taskId);
            return await bot.sendMessage(chatId, `❌ Вы отколнили задачу №${taskId}`);

        case 'commit':
            user.commitTask(taskId);
            return await bot.sendMessage(chatId, `❕ Вы утвердили задачу №${taskId}`);

        case 'uncommit':
            user.uncommitTask(taskId);
            return await bot.sendMessage(chatId, `❗️ Вы отправили задачу №${taskId} на доработку`);
    }
}