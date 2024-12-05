import Fastify from 'fastify';
import cors from '@fastify/cors';

export const fastify = Fastify({logger: true});

export const BASE_PATH = '/api/v1';

await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})