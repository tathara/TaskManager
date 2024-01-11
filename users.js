import Task from './task.js';
import TaskManager from './task-manager.js';

export {
    CommonUser,
    RootUser
}

const taskManager = new TaskManager();

class User {
    constructor(name, role) {
        this.name = name;
        this.role = role;
        this.tasks = {};
    }

    takeTask(taskId) {
        const task = taskManager.getTask(taskId);
        this.tasks = { ...this.tasks, task };
    }

    rejectTask(task) {
        if (this.tasks[task]) delete this.tasks[task];
    }

    commitTask(task) {
        taskManager.commitTask(task);
    }

    uncommitTask(task) {
        taskManager.uncommitTask(task);
    }

    getAllTasks() {
        const tasks = taskManager.getAllTasks();
        return tasks;
    }

    getThisTasks() {
        return this.tasks;
    }

    getThisTasksString() {
        const thisTasks = taskManager.makeTasksString(this.tasks);
        return thisTasks;
    }

    getCommitedTasks() {
        const tasks = taskManager.getCommitedTasks();
        return tasks;
    }

    getCompletedTasks() {
        const tasks = taskManager.getCompletedTasks();
        return tasks;
    }

    getAllTasksString() {
        const tasks = taskManager.getTasksString();
        return tasks;
    }

    getCommitedTasksString() {
        const tasks = taskManager.getCommitedTasksString();
        return tasks;
    }

    getCompletedTasksString() {
        const tasks = taskManager.getCompletedTasksString();
        return tasks;
    }
}

class CommonUser extends User {
    constructor(name, role) {
        super(name, role);
        this.rights = "common";
    }
}

class RootUser extends User {
    constructor(name, role) {
        super(name, role);
        this.rights = "root";
    }

    createTask(name, assignedRole, description, deadline, complexity) {
        return new Task(name, assignedRole, description, deadline, complexity);
    }

    addTask(task) {
        taskManager.addTask(task, this);
    }

    deleteTask(task) {
        taskManager.deleteTask(task, this);
    }
}
