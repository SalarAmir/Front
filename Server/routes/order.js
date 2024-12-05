import { BASE_PATH, fastify } from "./init.js";

import { getOrders, getOrder, createOrder, updateQuote } from "../controllers/order.js";

fastify.get(`${BASE_PATH}/orders`, async (request, reply) => {
    await getOrders(request, reply);
});

fastify.get(`${BASE_PATH}/order`, async (request, reply) => {
    await getOrder(request, reply);
});

fastify.post(`${BASE_PATH}/orders`, async (request, reply) => {
    await createOrder(request, reply);
});

fastify.put(`${BASE_PATH}/order/quote`, async(request, reply)=>{
    await updateQuote(request, reply);
} )
