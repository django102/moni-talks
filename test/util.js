const fs = require('fs');
const path = require('path');

const fixtures = {};

function parseFixture(name) {
    if (!Object.prototype.hasOwnProperty.call(fixtures, name)) {
        throw new Error(`Fixture ${name} does not exist`);
    }

    return JSON.parse(fixtures[name]);
}

module.exports = {
    load: (directory) => {
        console.log(`Loading Fixtures.... \n`);

        try {
            const dirPath = path.resolve(__dirname, directory);
            const files = fs.readdirSync(dirPath).filter((filename) => filename.endsWith('.json'));

            files.forEach((file) => {
                const fileBase = file.slice(0, -5); //remove the .json extension
                fixtures[fileBase] = fs.readFileSync(`${dirPath}/${file}`);
            });

            console.log(`Fixtures loaded!!! \n`);
        } catch (err) {
            throw new Error(err);
        }
    },

    get: (name) => {
        try {
            if (typeof name === 'string') {
                return parseFixture(name);
            }

            const response = {};
            name.forEach(key => {
                response[key] = parseFixture(key);
            });

            return response;
        } catch (err) {
            throw new Error(err);
        }
    },

    list: () => {
        return Object.keys(fixtures);
    }
}