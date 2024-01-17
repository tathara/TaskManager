import TelegramBot from 'node-telegram-bot-api';
import { UserModel } from './db/models.js';

let user;
const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegramToken, { polling: true });

const authOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: '🔑 Авторизация', web_app: { url: process.env.AUTHORIZATION_URL } }, { text: '🗝 Регистрация', web_app: { url: process.env.REGISTRATION_URL } }],
        ]
    })
};

const botOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['🔍 Все задачи', '💡 Персональные задачи'],
            ['✅ Взять задачу', '❌ Отклонить задачу'],
            ['❕ Утвердить задачу', '❗️ Отправить задачу на доработку']
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    })
};

bot.setMyCommands([
    { command: '/start', description: 'Аутентификация' },
]);

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.chat.first_name;

    if (text === '/start' && user) {
        await bot.sendMessage(chatId, `👀 ${userName}, ты уже авторизован под логином ${user.login}!`)
        return await sendMainMenu(chatId);
    }
    else if (text === '/start') {
        await bot.sendMessage(chatId, `✅ Привет, ${userName}!`);
        return await bot.sendMessage(chatId, `😎 Я помогу тебе разобраться с управлением над командными задачами, но для начала тебе предстоит пройти аутентификацию!`, authOptions);
    }
    else if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            user = await UserModel.findByPk(data.id);

            if (user) {
                await bot.sendMessage(chatId, `✅ Аутентификация успешно пройдена!`);
                return await sendMainMenu(chatId);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        return bot.sendMessage(chatId, `⛔️ Я не понимаю о чем ты!`,);
    }
});

async function sendMainMenu(chatId) {
    await bot.sendMessage(chatId, '🏁 Ты сейчас находишься в главном меню!', botOptions);
}

// bot.on('callback_query', async msg => {
//     const data = msg.data;
//     const chatId = msg.message.chat.id;

//     processCallback(data, chatId)
// });

// function fillKeys(tasks, action) {
//     return Object.keys(tasks).map(key => [{ text: key, callback_data: `${action}_${key}` }]);
// }

// function makeMarkup(tasks, action) {
//     const markup = {
//         reply_markup: JSON.stringify({
//             inline_keyboard: fillKeys(tasks, action),
//         })
//     }

//     return markup;
// }

// async function processAction(action, chatId) {
//     const tasks = action === 'take' ? user.getAllTasks() : user.getThisTasks();
//     const tasksOptions = makeMarkup(tasks, action);

//     await bot.sendMessage(chatId, 'Выберите номер задачи', tasksOptions);
// }

// async function processCallback(data, chatId) {
//     switch (data) {
//         case 'tasks':
//             const tasks = user.getAllTasksString();
//             return await bot.sendMessage(chatId, tasks);

//         case 'thisTasks':
//             const thisTasks = user.getThisTasksString();
//             return await bot.sendMessage(chatId, thisTasks);

//         case 'take':
//             return await processAction('take', chatId);

//         case 'reject':
//             await processAction('reject', chatId);
//             return;

//         case 'commit':
//             await processAction('commit', chatId);
//             return;

//         case 'uncommit':
//             await processAction('uncommit', chatId);
//             return;

//         default:
//             await processInput(data, chatId);
//     }
// }

// async function processInput(input, chatId) {
//     const action = input.split('_');
//     const taskId = action[1];

//     switch (action[0]) {
//         case 'take':
//             user.takeTask(taskId);
//             return await bot.sendMessage(chatId, `✅ Вы взяли задачу №${taskId}`);

//         case 'reject':
//             user.rejectTask(taskId);
//             return await bot.sendMessage(chatId, `❌ Вы отколнили задачу №${taskId}`);

//         case 'commit':
//             user.commitTask(taskId);
//             return await bot.sendMessage(chatId, `❕ Вы утвердили задачу №${taskId}`);

//         case 'uncommit':
//             user.uncommitTask(taskId);
//             return await bot.sendMessage(chatId, `❗️ Вы отправили задачу №${taskId} на доработку`);
//     }
// }