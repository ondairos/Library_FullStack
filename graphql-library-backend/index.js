const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')

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

// import typedefs

//import resolvers

// fieldName(obj, args, context, info) { result }

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


