const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')

// mongoose
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

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

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: String
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: String): [Book!]!
    allAuthors: [Author!]!
    findBook(title: String!): Book
    me: User
  }

  type Mutation {
    addBook(
        title: String!
        published: Int!
        author: String
        genres: [String]
    ): Book!

    editPublished(
        title: String!
        published: Int!
    ): Book

    editAuthor(
        name: String!
        born: Int!
    ): Author

    addAuthor(
      name: String!
      born: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    addAsUserBooks(
      title: String!
    ): User
  }
`

const resolvers = {
  Query: {
    // bookCount: () => books.length,
    bookCount: async () => {
      Book.collection.countDocuments()
    },
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      return await Book.find({})
    },
    allAuthors: async () => {
      return await Author.find({})
    },
    findBook: async (root, args) => {
      // return Book.findOne({ title: args.title })
      return Book.findOne({ title: args.title })
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return await Book.count({ author: root.id })
    }
  },
  Book: {
    author: async (root, args) => await Author.findById(root.author),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      // add current user
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      // author for new book
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = await new Author({ name: args.author }).save()
      }

      //must pass the author object to the new book so it can take the id etc
      // TODO
      const newBook = new Book({
        title: args.title,
        published: args.published,
        author,
        genres: args.genres,
      })
      try {
        await newBook.save()
        //add book to current user
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError('Saving a book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return newBook
    },
    editPublished: async (root, args, context) => {
      const specificBook = await Book.findOne({ title: args.title })
      specificBook.published = args.published

      try {
        await specificBook.save()
      } catch (error) {
        throw new GraphQLError('Editing published date failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return specificBook
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      // find the index of the author to edit in the authors array
      const foundIndex = authors.findIndex(element => element.name === args.name)

      if (foundIndex === -1) {
        return null
      }
      try {
        const updatedAuthor = await Author.findOneAndUpdate(
          { name: args.name },
          { name: args.name, born: args.born },
          { new: true }
        )
        return updatedAuthor
      } catch (error) {
        throw new GraphQLError('editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
    },
    // user mutations
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  }
}

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


