import { UserModel, TaskModel } from '../db/models.js';

export default class TaskController {
    async getTask(taskId) {
        try {
            const task = await TaskModel.findByPk(taskId);

            return task;
        }
        catch (error) {
            console.log(error);
        }
    }

    async addTask(task) {
        try {
            await TaskModel.create({
                name: task.name,
                assignedRole: task.assignedRole,
                description: task.description,
                deadline: task.deadline,
                complexity: task.complexity,
                status: task.status,
                organizationId: user.organizationId
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    async deleteTask(taskId) {
        try {
            const task = await TaskModel.findByPk(taskId);
            await task.destroy();
        }
        catch (error) {
            console.log(error);
        }
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

            if (tasks) {
                return tasks;
            }
            else {
                throw new Error('Задачи не найдены!');
            }
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

    makeTasksString(tasks) {
        if (tasks.length === 0) return "Список задач пуст!";

        let taskString = "";

        for (let task of tasks) {
            let tasksChunk = `🆔 ${task.id}. ${task.name}\n`
            tasksChunk += `🚩 Назначение: ${task.assignedRole}\n`
            tasksChunk +=`📝 Описание: ${task.description}\n`
            tasksChunk +=`📛 Дедлайн: ${task.deadline}\n`
            tasksChunk +=`⚒ Сложность: ${task.complexity}\n`
            tasksChunk +=`♻ Статус: ${task.status}`
            taskString += tasksChunk + '\n\n';
        }

        return taskString;
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