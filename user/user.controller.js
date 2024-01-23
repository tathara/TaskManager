import TaskController from '../task/task.controller.js';
import { UserModel } from '../db/models.js';

const taskController = new TaskController();

export default class UserController {
    async #initializeUser(data) {
        this.user = await UserModel.findByPk(data.id);
    }

    constructor(data) {
        this.user = null;
        this.#initializeUser(data);
    }

    async takeTask(taskId) {
        try {
            const task = await taskController.getTask(taskId);
            await this.user.addTask(task);
        }
        catch (error) {
            console.log(error);
        }
    }

    async rejectTask(taskId) {
        try {
            const task = await taskController.getTask(taskId);
            await this.user.removeTask(task);
        }
        catch (error) {
            console.log(error);
        }
    }

    async commitTask(taskId) {
        try {
            await taskController.commitTask(taskId);
        }
        catch (error) {
            console.log(error);
        }
    }

    async uncommitTask(task) {
        try {
            await taskController.uncommitTask(task);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getAllTasks() {
        try {
            const tasks = await taskController.getAllTasks();

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getThisTasks() {
        try {
            const tasks = await this.user.getTasks();

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCommitedTasks() {
        try {
            const tasks = await taskController.getCommitedTasks();

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCompletedTasks() {
        try {
            const tasks = await taskController.getCommitedTasks();

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getAllTasksString() {
        try {
            const tasks = await taskController.getAllTasksString().then(string => {
                return string;
            });

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getThisTasksString() {
        try {
            const tasks = await this.getThisTasks();
            const thisTasks = taskController.makeTasksString(tasks);

            return thisTasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCommitedTasksString() {
        try {
            const tasks = await taskController.getCommitedTasksString();

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCompletedTasksString() {
        try {
            const tasks = await taskController.getCompletedTasksString();

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }
}