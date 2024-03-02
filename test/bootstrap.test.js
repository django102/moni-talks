
const { load: loadFixtures } = require('./util');
loadFixtures('./unit/fixtures');

const express = require("express");
const routes = require('../api/routes');


module.exports = {
    bootstrapApp: async () => {
        // Load Environment Variables
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

        const app = express();
        app.use(express.urlencoded({ extended: false }));
        app.use('/', routes);

        return {
            app,
            env:process.env
        }
    }
}


/*
 //  bootstrapApp : async () => {
    //     // Load environment variables
    //     process.env.NODE_ENV = 'test';
    //     process.env.PORT = 80;
    //     process.env.DB_HOST = 'localhost';
    //     process.env.DB_DATABASE = 'moni';
    //     process.env.DB_PORT = 3306;
    //     process.env.DB_USER = 'test';
    //     process.env.DB_PASSWORD = 'test';
    //     process.env.APP_NAME = 'Moni';
    //     process.env.WEBHOOK_HASHER = 'xxYYzz';
    //     process.env.JWT_HASHER = 'xxYYzz';
        
    //     const app = express();
    //     app.use(express.urlencoded({extended:false}));
    //     app.use('/', routes);
        
    //     return {

    //     }
    //     };
}






// const express = require("express");
// const routes = require('../api/routes');
// const { load: loadFixtures } = require('./util');

// loadFixtures('./unit/fixtures');

// console.log('Initializing application...');

// const bootstrapApp = async () => {
// const app = express();
// app.use(express.urlencoded({extended:false}));
// app.use('/', routes);

// return {
//     app
// };
// }



// const express = require('express');
// const routes = require('../api/routes');

// // Load environment variables
// process.env.NODE_ENV = 'test';
// process.env.PORT = 80;
// process.env.DB_HOST = 'localhost';
// process.env.DB_DATABASE = 'moni';
// process.env.DB_PORT = 3306;
// process.env.DB_USER = 'test';
// process.env.DB_PASSWORD = 'test';
// process.env.APP_NAME = 'Moni';
// process.env.WEBHOOK_HASHER = 'xxYYzz';
// process.env.JWT_HASHER = 'xxYYzz';

// // Declare variables for Express app and server
// let app, server;

// // Create Express app and start server
// before(function (done) {
//     console.log('Initializing application...');

//     app = express();
//     app.use(express.urlencoded({ extended: false }));
//     app.use("/", routes);

//     // Start Express server
//     server = app.listen(process.env.PORT, () => {
//         console.log(`Server is running on port ${process.env.PORT}`);
//         done(); // Call done() to indicate initialization is complete
//     });
// });

// // Export the Express app and server
// module.exports = {
//     app,
//     server
// };

// // Gracefully shutdown the server after all tests complete
// after(function (done) {
//     console.log('Shutting down server...');
//     server.close(done);
// });









// /*
// import * as http from "http";

// import { Application } from "express";
// import { bootstrapMicroframework } from "microframework-w3tec";

// import { catchAllLoader } from "../../../loaders/catchAllLoader";
// import { eventDispatchLoader } from "../../../loaders/eventDispatchLoader";
// import { expressLoader } from "../../../loaders/expressLoader";
// import { iocLoader } from "../../../loaders/iocLoader";
// import { metricsLoader } from "../../../loaders/metricsLoader";
// import { winstonLoader } from "../../../loaders/winstonLoader";

// import { dbLoader } from "./databasesLoader";

// export interface BootstrapSettings {
//   app: Application;
//   server: http.Server;
//   connection: any;
// }

// export const bootstrapApp = async (): Promise<BootstrapSettings> => {
//     return bootstrapMicroframework({
//         loaders: [
//             winstonLoader,
//             iocLoader,
//             eventDispatchLoader,
//             dbLoader,
//             metricsLoader,
//             expressLoader,
//             catchAllLoader,
//         ],
//     }).then((framework) => {
//         return {
//             app: framework.settings.getData("express_app") as Application,
//             server: framework.settings.getData("express_server") as http.Server,
//             connection: framework.settings.getData("mongoConnection"),
//         } as BootstrapSettings;

//     });
// };

// */



// // const express = require('express');
// // const routes = require('../api/routes');

// // const { load: loadFixtures } = require('./util');
// // loadFixtures('./unit/fixtures');

// // let app;

// // before(
// //     () =>
// //         new Promise(async (resolve, reject) => {
// //             process.env.NODE_ENV = 'test';
// //             process.env.PORT = 80;

// //             process.env.DB_HOST = 'localhost';
// //             process.env.DB_DATABASE = 'moni';
// //             process.env.DB_PORT = 3306;
// //             process.env.DB_USER = 'test';
// //             process.env.DB_PASSWORD = 'test';

// //             process.env.APP_NAME = 'Moni';
// //             process.env.WEBHOOK_HASHER = 'xxYYzz';
// //             process.env.JWT_HASHER = 'xxYYzz';


// //             console.log('Starting application... \n');

            

// //             app = express();

            

// //             app.use(express.urlencoded({ extended: false }));
// //             app.use("/", routes);

// //             console.log("Environment", process.env.NODE_ENV);

// //             return resolve(app);
// //         }),
// // );

// // after((done) => {
// //     console.log('Stopping application... \n');
// //     done();
// // });

// // module.exports = app;
