import Task from './task.js';
import { UserModel, TaskModel } from './db/models.js';

export default UserTaskController;

class UserTaskController {
    async takeTask(userId, taskId) {
        try {
            const user = await userController.getUserById(userId);
            const task = await taskController.getTask(taskId);
            await user.addTask(task);
        }
        catch (error) {
            console.log(error);
        }
    }

    async rejectTask(userId, taskId) {
        try {
            const user = await userController.getUserById(userId);
            const task = await taskController.getTask(taskId);
            await user.removeTask(task);
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

    async #getTasks(method) {
        try {
            const tasks = await method();

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getAllTasks() {
        const tasks = await this.#getTasks(taskController.getAllTasks);

        return tasks;
    }

    async getThisTasks(userId) {
        try {
            const user = await userController.getUserById(userId);
            const tasks = await user.getTasks();

            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCommitedTasks() {
        const tasks = await this.#getTasks(taskController.getCommitedTasks);
        
        return tasks;
    }

    async getCompletedTasks() {
        const tasks = await this.#getTasks(taskController.getCompletedTasks);
        
        return tasks;
    }

    async getAllTasksString() {
        const tasks = await this.#getTasks(taskController.getAllTasksString);
        
        return tasks;
    }

    async getThisTasksString(userId) {
        try {
            const tasks = await this.getThisTasks(userId);
            const thisTasks = taskController.makeTasksString(tasks);
            return thisTasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCommitedTasksString() {
        const tasks = await this.#getTasks(taskController.getCommitedTasksString());
        
        return tasks;
    }

    async getCompletedTasksString() {
        const tasks = await this.#getTasks(taskController.getCompletedTasksString());
        
        return tasks;
    }

    createTask(name, assignedRole, description, deadline, complexity) {
        return new Task(name, assignedRole, description, deadline, complexity);
    }

    async addTask(task) {
        await taskController.addTask(task);
    }

    async deleteTask(task) {
        await taskController.deleteTask(task);
    }
}