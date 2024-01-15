import { UserModel, OrganizationModel } from '../db/models.js';
import Hasher from '../hasher.js';

const hasher = new Hasher();

export class ServerAuthorization {
    async #createUser(data) {
        try {
            const { fullName, login, password, organization: organizationName, role } = data;
            const [organization] = await OrganizationModel.findOrCreate({
                where:
                {
                    name: organizationName
                }
            });
            const hashPassword = await hasher.hash(password);
            const user = await organization.createUser({ fullName, login, password: hashPassword, role });

            return user;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    async registerUser(data) {
        try {
            const { login: userLogin } = data;
            let user = await UserModel.findOne({
                where:
                {
                    login: userLogin
                }
            });

            if (user) {
                throw new Error('Пользователь с таким логином уже существует!');
            }

            user = this.#createUser(data);

            return user;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    async authorizeUser(data) {
        try {
            const { login, password } = data;
            const user = await UserModel.findOne({
                where:
                {
                    login: login
                }
            });

            if (!user) {
                throw new Error('Пользователь с таким логином не найден!');
            }

            const isValid = await hasher.validate(password, user.password);

            if (!isValid) {
                throw new Error('Неправильный пароль!')
            }

            return user;
        }
        catch (error) {
            console.log(error);
            throw (error);
        }
    }
}