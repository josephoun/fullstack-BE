import * as bodyParser from "body-parser";
import * as express from "express";
import {Logger} from "./logger/logger";
import Routes from "./routes/routes";
import {MongoClient} from "mongodb";

class App {

    public express: express.Application;
    public logger: Logger;

    // array to hold users
    public users: any[];

    uri: string;
    client: MongoClient;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.users = [];
        this.client = new MongoClient(this.uri);
        this.logger = new Logger();
    }

    // Configure Express middleware.n
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));

        async function main() {
            /**
             * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
             * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
             */
            const uri = "mongodb+srv://josephoun14:SolyQb7jejdhTvND@userscluster.pglou.mongodb.net/usersdb?retryWrites=true&w=majority";

            const client = new MongoClient(uri);

            try {
                // Connect to the MongoDB cluster
                await client.connect();

                // Make the appropriate DB calls
                await listDatabases(client);

            } catch (e) {
                console.error(e);
            } finally {
                await client.close();
            }
        }

        main().catch(console.error);

        /**
         * Print the names of all available databases
         * @param {MongoClient} client A MongoClient that is connected to a cluster
         */
        async function listDatabases(client: MongoClient) {
            let databasesList = await client.db().admin().listDatabases();
            console.log("My mongo Databases:");
            databasesList.databases.forEach((db: any) => console.log(` - ${db.name}`));
        };
    }


    private routes(): void {

        this.express.get("/", (req, res, next) => {
            res.send("Typescript App works!!");
        });

        // user route
        this.express.use("/api", Routes);

        // handle undefined routes
        this.express.use("*", (req, res, next) => {
            res.send("Make sure url is correct!!!");
        });
    }
}

export default new App().express;
