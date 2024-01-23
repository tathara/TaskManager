export {
    authOptions,
    botOptions,
    makeTaskMarkup as makeMarkup
}

const authOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: '🔑 Авторизация', web_app: { url: process.env.AUTHORIZATION_URL } },
            { text: '🗝 Регистрация', web_app: { url: process.env.REGISTRATION_URL } }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    })
};

const botOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '🔍 Все задачи', callback_data: 'tasks' }, { text: '💡 Мои задачи', callback_data: 'thisTasks' }],
            [{ text: '✅Взять задачу', callback_data: 'take' }, { text: '❌ Отклонить задачу', callback_data: 'reject' }],
            [{ text: '❕ Утвердить задачу', callback_data: 'commit' }, { text: '❗️ Отправить задачу на доработку', callback_data: 'uncommit' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    })
};

function fillKeys(tasks, action) {
    return tasks.map(task => [{ text: task.id, callback_data: `${action}_${task.id}` }]);
}

function makeTaskMarkup(tasks, action) {
    const markup = {
        reply_markup: JSON.stringify({
            inline_keyboard: fillKeys(tasks, action),
        })
    }

    return markup;
}