import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";
import User from "./user";

class Routes {

    public express: express.Application;
    public logger: Logger;

    // array to hold users
    public users: any[];
    public posts: any[];

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new Logger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    private routes(): void {

        // user route
        this.express.use("/", User);
    }
}

export default new Routes().express;
