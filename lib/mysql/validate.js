const validate = require('mysql-query-validator').validate;
const fs = require('fs');

// receives one or more sql file or a migration file and validates it
let files = process.argv.length > 2 ? process.argv.slice(2) : ['migrations/sqls'];

console.log('files', files);

if (!files.length) {
    throw new Error(`Couldn't find any files to valdate. files: ${files}`);
}

validateFiles(files);

function validateDirectory(path) {
    if (!fs.lstatSync(path).isDirectory()) {
        throw new Error(`Path ${path} is not a directory`);
    }
    console.log(`Validating directory ${path} ...`);
    const files = fs.readdirSync(path).map(file => `${path}/${file}`);
    validateFiles(files);
}

function validateFiles(files) {
    for (let file of files) {
        //if relative path, prepend the current working directory
        if (!file.startsWith('/')) {
            file = `${process.cwd()}/${file}`;
        }
        if (!fs.existsSync(file)) {
            return;
        }
        //if it's directory, call validate directory
        if (fs.lstatSync(file).isDirectory()) {
            validateDirectory(file);
            continue;
        }
        //ignore down migration files and none sql files
        if (file.match(/.+-down\.sql/) || !file.match(/.+\.sql/)) {
            continue;
        }
        console.log(`Validating sql file ${file}`);
        validateFile(file);
    }
}

function validateFile(file) {
    // get file content
    const queries = fs.readFileSync(file).toString().split(';\n').filter(query => query.trim().length);
    for (const query of queries) {
        const response = validateSql(query);
        if (!response.status) {
            console.error(`Invalid sql in ${file}. Error: ${response.message}`);
            console.error(`SQL query: ${query}\n`);
            process.exit(1);
        }
    }
    console.log(`Sql file ${file} is valid`);
    return true;
}

function validateSql(query) {
    try {
        //remove comments from query
        const cleanedQuery = cleanQuery(query);
        console.log('cleanedQuery', cleanedQuery);
        if (!cleanedQuery) {
            return { status: true, message: `No sql to validate` };
        }
        validate(cleanedQuery);
        //make sure query doesn't contain create or alter statements
        const queryRegexes = [
            /^select\s+(.+)?\sfrom\s/ig,
            /^set\s@[\w\d\-]+/ig,
            /^delete\s+(LOW_PRIORITY\s)?(IGNORE\s)?(IGNORE\s)?from\s/ig,
            /^insert\s+((LOW_PRIORITY|DELAYED|HIGH_PRIORITY)\s)?(IGNORE\s)?into\s/ig,
            /^update\s+(LOW_PRIORITY\s)?(IGNORE\s)?(`?[\w\d\-]+`?(\.`?[\w\d\-]+`?)?)\s/ig,
        ];
        if (!queryRegexes.find(regex => regex.test(cleanedQuery))) {
            return { status: false, message: 'Non DML queries are not permitted.' };
        }
        return { status: true, message: `Sql is valid` };
    } catch (err) {
        return { status: false, message: err.message };
    }
}

function cleanQuery(query) {
    //remove comments, newlines and excessive white space
    const cleanedQuery = query.replace(/(\/\*\s*.+\s*\*\/)/igm, '')
        .replace(/^--(.+$)?/igm, '')
        .replace(/\s+|\n/ig, ' ');
    return cleanedQuery.trim();
}