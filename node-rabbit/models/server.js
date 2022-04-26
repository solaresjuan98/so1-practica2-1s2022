const express = require('express');
//const { router } = require('../routes/routes');
const {userRouter}  = require('../routes/user');
const cors = require("cors");
var corsOptions = { origin: true, optionsSuccessStatus: 200 };

class Server {

    constructor() {
        this.port = 3000;
        this.app = express();
        this.app.use(cors(corsOptions));
        this.routes();
    }

    routes() {
        this.app.use(express.json());
        //this.app.use('', router)
        this.app.use('', userRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}`)
        });
    }

}

module.exports = Server;