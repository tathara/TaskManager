import Express from 'express';
import db from '../db/db.js';
import { ServerAuthorization } from './server.authorization.js';
import fsp from 'fs/promises';
import getDirname from '../dirname.js';

const server = new Express();
const authorization = new ServerAuthorization();
const port = process.env.PORT || 8080;
const authorizationPath = getDirname() + '/server/form/html/authorization.html';
const registrationPath = getDirname() + '/server/form/html/registration.html';

server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));
server.use(Express.static(getDirname() + '/server/form'));

server.get('/authorization', async (req, res) => {
    try {
        const form = await fsp.readFile(authorizationPath, 'utf8');
        await res.status(200);
        await res.send(form);
    }
    catch (error) {
        await res.status(404);
        console.log(error);
    }
});

server.post('/authorization', async (req, res) => {
    try {
        const data = {
            login: req.body.login,
            password: req.body.password
        }

        const user = await authorization.authorizeUser(data);
        console.log(user);
        res.send(JSON.stringify(user));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/registration', async (req, res) => {
    try {
        const form = await fsp.readFile(registrationPath, 'utf8');
        await res.status(200);
        await res.send(form);
    }
    catch (error) {
        await res.status(404);
        console.log(error);
    }
});

server.post('/registration', async (req, res) => {
    try {
        const data = {
            fullName: req.body.fullName,
            login: req.body.login,
            password: req.body.password,
            organization: req.body.organization,
            role: req.body.role
        }

        const user = await authorization.registerUser(data);
        console.log(data);
        res.send(JSON.stringify(user));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function start() {
    try {
        await db.authenticate();
        await db.sync();
        server.listen(port, () => console.log(`Сервер запущен! Порт: ${port}`));
    }
    catch (error) {
        console.log(error);
    }
}

start();