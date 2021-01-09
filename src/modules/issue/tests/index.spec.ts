import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import application from '../../../index';

before(async () => {
    await createConnection();
});

export const request = supertest(application);