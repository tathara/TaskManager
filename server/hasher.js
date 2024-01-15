import bcrypt from 'bcryptjs';

export default class Hasher {
    constructor() {
        this.salt = +process.env.SALT
    }

    async hash(password) {
        const hashPassword = await bcrypt.hash(password, this.salt);
    
        return hashPassword;
    }
    
    async validate(password, hashPassword) {
        const isValid = await bcrypt.compare(password, hashPassword);
    
        return isValid;
    }
}