export default class Task {
    constructor(name, assignedRole, description, deadline, complexity) {
        this.name = name;
        this.assignedRole = assignedRole;
        this.description = description;
        this.deadline = deadline;
        this.complexity = complexity;
    }
}