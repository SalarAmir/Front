import "dotenv/config";
import "./config/db.js";
import { fastify, BASE_PATH} from "./routes/init.js";

const PORT = process.env.PORT || 5000;

fastify.listen(
    {host:"0.0.0.0", port: PORT}, 
    function (err, address) {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fastify.log.info(`Server listening on ${address}`);
    }
)

fastify.get(BASE_PATH, async (request, reply) => {
    
    return reply.send({ message: "Welcome to API" });
})

import "./routes/user.js";
import "./routes/cart.js";
import "./routes/order.js";