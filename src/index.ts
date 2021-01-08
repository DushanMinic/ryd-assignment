import "reflect-metadata";
import express, { NextFunction, Request, Response } from 'express';
import IssueController from './issue/issue.controller';
import { createConnection } from 'typeorm';


const PORT = 3000;

const application = express();

createConnection()
    .catch((error: Error) => {
        console.error('Failed to connect to the database.');
        process.exit(1);
    });

// Global middlewares
application.use(express.json());

// Controllers
application.use(IssueController);

application.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(error.stack);
    response.status(500).send(error);
});

application.listen(PORT, () => {
    console.log(`Server started listening at ${PORT}.`);
});
