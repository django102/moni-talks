const express = require('express');

const { load: loadFixtures } = require('./util');
loadFixtures('./unit/fixtures');

before(() => {
    new Promise(async (resolve, reject) => {

        process.env.NODE_ENV = 'test';
        process.env.PORT = 80;

        process.env.DB_HOST = 'localhost';
        process.env.DB_DATABASE = 'moni';
        process.env.DB_PORT = 3306;
        process.env.DB_USER = 'test';
        process.env.DB_PASSWORD = 'test';

        process.env.APP_NAME = 'Moni';
        process.env.WEBHOOK_HASHER = 'xxYYzz';
        process.env.JWT_HASHER = 'xxYYzz';


        console.log('Starting application... \n');

        const app = express();
        app.use(express.urlencoded({ extended: false }));

        app.listen(procss.env.PORT, () => {
            console.log('Application started... \n');
        });

        return resolve(app);
    });

});

after((done) => {
    console.log('Stopping application... \n');
    done();
});