import "reflect-metadata";
import express, { Request, Response } from 'express';

const PORT = 3000;

const application = express();

application.get('/', (request: Request, response: Response) => {
    response.send('ryd assignment');
});

application.listen(PORT, () => {
    console.log(`Server started listening at ${PORT}.`);
});
