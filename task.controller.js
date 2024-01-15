import { UserModel, TaskModel } from './db/models.js';

export default class TaskManager {
    async getTask(taskId) {
        try {
            const task = await TaskModel.findByPk(taskId);
            return task;
        }
        catch (error) {
            console.log(error);
        }
    }

    async addTask(task, userId) {
        try {
            const user = await UserModel.findByPk(userId);
            await TaskModel.create({
                organizationId: user.organizationId,
                name: task.name,
                assignedRole: task.assignedRole,
                description: task.description,
                deadline: task.deadline,
                complexity: task.complexity,
                status: task.status
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    restoreRejectedTask(task) {
        this.tasks.active = { ...this.tasks.active, task };
    }

    async deleteTask(taskId, userId) {
        try {
            const task = await TaskModel.findByPk(taskId);
            await task.destroy();
        }
        catch (error) {
            console.log(error);
        }
    }

    deleteTakenTask(task) {
        if (this.active[task]) delete this.tasks.active[task];
    }

    async commitTask(taskId) {
        try {
            const task = await TaskModel.findByPk(taskId);
            task.status = 'Утвержденный';
            task.save();
        }
        catch (error) {
            console.log(error);
        }
    }

    async uncommitTask(taskId) {
        try {
            const task = await TaskModel.findByPk(taskId);
            task.status = 'Активный';
            task.save();
        }
        catch (error) {
            console.log(error);
        }
    }

    async completeTask(taskId) {
        try {
            const task = await TaskModel.findByPk(taskId);
            task.status = 'Завершенный';
            task.save();
        }
        catch (error) {
            console.log(error);
        }
    }

    async getAllTasks() {
        try {
            const tasks = await TaskModel.findAll();
            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCommitedTasks() {
        try {
            const tasks = await TaskModel.findAll({ where: { status: 'Утвержденный' } });
            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCompletedTasks() {
        try {
            const tasks = await TaskModel.findAll({ where: { status: 'Завершенный' } });
            return tasks;
        }
        catch (error) {
            console.log(error);
        }
    }

    makeTasksString(pool) {
        if (Object.keys(pool).length === 0) return "Список задач пуст!";

        let result = "";

        for (let [id, task] of Object.entries(pool)) {
            let taskString = `🆔${id}. ${task.name}
            ➡️Назначение: ${task.assignedRole}
            🗒Описание: ${task.description}
            📛Дедлайн: ${task.deadline}
            🧐Трудоемкость: ${task.complexity}`;
            result += taskString + '\n\n';
        }

        return result;
    }

    async getAllTasksString() {
        try {
            const tasks = await this.getAllTasks();
            const result = this.makeTasksString(tasks);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCommitedTasksString() {
        try {
            const tasks = await this.getCommitedTasks();
            const result = this.makeTasksString(tasks);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCompletedTasksString() {
        try {
            const tasks = await this.getCompletedTasks();
            const result = this.makeTasksString(tasks);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
}