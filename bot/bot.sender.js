import { botOptions } from "./bot.options.js";

export default class BotSender {
    constructor(bot, userController) {
        this.bot = bot;
        this.userController = userController;
    }

    async sendMainMenu(chatId) {
        await this.bot.sendMessage(chatId, '🏁 Ты сейчас находишься в главном меню!', botOptions);
    }
    async sendAllTasks(chatId) {
        const taskString = await this.userController.getAllTasksString();
        return this.bot.sendMessage(chatId, taskString);
    }

    async sendCommitedTasks(chatId) {
        const taskString = await this.userController.getCommitedTasksString();
        return this.bot.sendMessage(chatId, taskString);
    }

    async sendThisTasks(chatId) {
        const taskString = await this.userController.getThisTasksString();
        return this.bot.sendMessage(chatId, taskString);
    }
}