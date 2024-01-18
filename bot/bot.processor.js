import { makeMarkup } from "./bot.options.js";

export default class BotProcessor {
    constructor(bot, userController, botSender) {
        this.bot = bot;
        this.userController = userController;
        this.botSender = botSender;
    }
    async processCallback(data, chatId) {
        switch (data) {
            case 'tasks':
                await this.botSender.sendAllTasks(chatId);
                break;

            case 'thisTasks':
                await this.botSender.sendThisTasks(chatId);
                break;

            case 'take':
                await this.botSender.sendAllTasks(chatId);
                await this.processAction('take', chatId);
                break;

            case 'reject':
                await this.botSender.sendThisTasks(chatId);
                await this.processAction('reject', chatId);
                break;

            case 'commit':
                await this.botSender.sendThisTasks(chatId);
                await this.processAction('commit', chatId);
                break;

            case 'uncommit':
                await this.botSender.sendCommitedTasks(chatId);
                await this.processAction('uncommit', chatId);
                break;

            default:
                await this.processInput(data, chatId);
        }

        this.botSender.sendMainMenu();
    }

    async processInput(input, chatId) {
        const action = input.split('_');
        const taskId = action[1];

        switch (action[0]) {
            case 'take':
                await this.userController.takeTask(taskId);
                return this.bot.sendMessage(chatId, `✅ Ты взял задачу №${taskId}!`);

            case 'reject':
                await this.userController.rejectTask(taskId);
                return this.bot.sendMessage(chatId, `❌ Ты отколнил задачу №${taskId}!`);

            case 'commit':
                await this.userController.commitTask(taskId);
                return this.bot.sendMessage(chatId, `❕ Ты утвердил задач №${taskId}!`);

            case 'uncommit':
                await this.userController.uncommitTask(taskId);
                return this.bot.sendMessage(chatId, `❗️ Ты отправил задачу №${taskId} на доработку!`);
        }
    }

    async processAction(action, chatId) {
        const tasks = action === 'take' ?
            await this.userController.getAllTasks().then(allTasks => allTasks) :
            await this.userController.getThisTasks().then(thisTasks => thisTasks);

        const tasksOptions = makeMarkup(tasks, action);

        await this.bot.sendMessage(chatId, 'Выберите номер задачи', tasksOptions);
    }
}