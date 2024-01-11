export default class TaskManager {
    constructor() {
        this.tasks = {
            active: {
                1: {
                    name: 'lol',
                    assignedRole: 'back',
                    description: 'lol',
                    deadline: 'deaddaed',
                    complexity: 'xD',
                }
            },
            commited: {},
            completed: {}
        }
    }

    getTask(taskId) {
        const task = {};
        task[taskId] = JSON.parse(JSON.stringify(this.tasks.active[taskId]));
        return task;
    }

    addTask(task, user) {
        if (user.rights !== "root") return;

        id = active.length + 1;
        this.tasks.active[id] = task;
    }

    restoreRejectedTask(task) {
        this.tasks.active = { ...this.tasks.active, task };
    }

    deleteTask(task, user) {
        if (user.rights !== "root") return;

        if (this.active[task]) delete this.tasks.active[task];
    }

    deleteTakenTask(task) {
        if (this.active[task]) delete this.tasks.active[task];
    }

    commitTask(task) {
        this.tasks.commited = { ...this.tasks.commited, task };
    }

    uncommitTask(task) {
        if (this.tasks.commited[task]) delete this.tasks.commited[task];
    }

    completeTask(task) {
        this.tasks.completed = { ...this.tasks.completed, task };
    }

    getAllTasks() {
        return this.tasks.active;
    }

    getCommitedTasks() {
        return this.tasks.commited;
    }

    getCompletedTasks() {
        return this.tasks.completed;
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

    getTasksString() {
        const result = this.makeTasksString(this.tasks.active);
        return result;
    }

    getCommitedTasksString() {
        const result = this.makeTasksString(this.tasks.commited);
        return result;
    }

    getCompletedTasksString() {
        const result = this.makeTasksString(this.tasks.completed);
        return result;
    }
}