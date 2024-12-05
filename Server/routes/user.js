import { fastify, BASE_PATH } from "./init.js";
import { createUser, loginUser, getUsers, getUser, deleteUser} from "../controllers/user.js";

fastify.post(`${BASE_PATH}/user/signup`, async (request, reply) => {
    await createUser(request, reply);
})

fastify.post(`${BASE_PATH}/user/login`, async (request, reply) => {
    await loginUser(request, reply);
})

fastify.get(`${BASE_PATH}/users`, async (request, reply) => {
    await getUsers(request, reply);
});

fastify.get(`${BASE_PATH}/user`, async (request, reply) => {
    await getUser(request, reply);
})

fastify.delete(`${BASE_PATH}/user`, async (request, reply) => {
    await deleteUser(request, reply);
})