import Fastify from 'fastify'
import cors from "@fastify/cors"
import routes from './interfaces/routes/routes'

const server = Fastify()
server.register(cors)
routes(server)

server.listen({port: 1234
})
.then( () => {
    console.log('HTTP Server running')
})