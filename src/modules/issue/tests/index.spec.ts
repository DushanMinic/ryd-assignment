import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import application from '../../../index';

before(async () => {
    await (await createConnection()).synchronize(true);
});

export const request = supertest(application);