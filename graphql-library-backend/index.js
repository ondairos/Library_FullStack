const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')

//websocket
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')


// express + bodyparser + cors
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')

// mongoose
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/user')

//import resolvers and typedefs
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

//jwt token
const jwt = require('jsonwebtoken')

// dotenv
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

//connect
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB!')
  }).catch((error) => {
    console.log('error connection to MongoDB: ', error.message)
  })


//////////////////////////////////////////////////
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

// startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async ({ req, res }) => {
//     const auth = req ? req.headers.authorization : null
//     if (auth && auth.toLowerCase().startsWith('bearer ')) {
//       const decodedToken = jwt.verify(
//         auth.substring(7), process.env.JWT_SECRET
//       )
//       const currentUser = await User.findById(decodedToken.id)
//       return { currentUser }
//     }
//   },
// }).then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// })
//////////////////////////////////////////////////

//setup is now inside a function start
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  // websocket
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  // When queries and mutations are used, GraphQL uses the HTTP protocol in the communication. In case of subscriptions, the communication between client and server happens with WebSockets.
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`ServerRR is now running on http://localhost:${PORT}`)
  )
}

//invoke the start function
start()