import db from "./db.js";
import { DataTypes } from "sequelize";

export {
    Organization as OrganizationModel,
    User as UserModel,
    Task as TaskModel,
    UserTask as UserTaskModel
};

const Organization = db.define('organization', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const User = db.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING },
    login: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING }
});

const Task = db.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    assignedRole: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    deadline: { type: DataTypes.STRING, allowNull: false },
    complexity: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }
});

const UserTask = db.define('userTask', {
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' } },
    taskId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Task, key: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' } },
});

Organization.hasMany(User);
User.belongsTo(Organization);

Organization.hasMany(Task);
Task.belongsTo(Organization);

User.belongsToMany(Task, { through: UserTask });
Task.belongsToMany(User, { through: UserTask });