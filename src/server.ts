import Fastify from 'fastify'
import cors from "@fastify/cors"

const server = Fastify()
server.register(cors)

server.listen({port: 1234
})
.then( () => {
    console.log('HTTP Server running')
})