import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";
import {MongoClient} from "mongodb";

class User {

    public express: express.Application;
    public logger: Logger;

    // array to hold users
    public users: any[];
    public posts: any[];

    uri: string;
    client: MongoClient;


    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.users = [{
            id: 1234,
            userName: 'test',
            password: 'test'
        }];
        this.posts = [{
            title: 'Weather',
            content: 'The weather is good today'
        }];
        this.logger = new Logger();
        this.client = new MongoClient(this.uri);
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        async function main() {

            const uri = "mongodb+srv://josephoun14:SolyQb7jejdhTvND@userscluster.pglou.mongodb.net/usersdb?retryWrites=true&w=majority";

            const client = new MongoClient(uri);

            try {
                // Connect to the MongoDB cluster
                await client.connect();

            } catch (e) {
                console.error(e);
            } finally {
                await client.close();
            }
        }

        main().catch(console.error);
    }

    private routes(): void {

        // request to get all the users
        this.express.get("/users", (req, res, next) => {
            this.logger.info("url:::::" + req.url);
            res.json(this.users);
        });

        // request to get all the users by userName
        this.express.get("/users/:userName", (req, res, next) => {
            this.logger.info("url:::::" + req.url);
            const user = this.users.filter(function(user) {
                if (req.params.userName === user.userName) {
                    return user;
                }
            });
            res.json(user);
        });

        // request to post the user
        // req.body has object of type {userId: id, posts: []}
        this.express.post("/user", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);
            this.users.push(req.body.user);
            res.json(this.users);
        });

        // request to post the user
        // req.body has object of type {userId: id, posts: []}
        this.express.get("/posts", (req, res, next) => {
            this.logger.info("url [posts]:::::::" + req.url);
            res.json(this.posts);
        });

        this.express.post("/addToFavorites", (req, res, next) => {
            this.logger.info("url [auth]:::::::" + req.url);
            this.logger.info("url [auth]:::::::" + JSON.stringify(req.body.post));
            this.logger.info("url [auth]:::::::" + JSON.stringify(req.body.userValue));
            res.json(this.users);
        });


        this.express.post("/authenticate", (req, res, next) => {
            this.logger.info("url [auth]:::::::" + req.url);
            this.logger.info("req body user" + JSON.stringify(req.body));

            this.users.forEach(user => {
                if (req.body.username === user.userName) {
                    if (req.body.password === user.password) {
                        res.json(user)
                    }
                }
            })
            res.status(403);
            res.statusMessage = 'forbidden';
            res.send()
        });
    }
}

export default new User().express;
