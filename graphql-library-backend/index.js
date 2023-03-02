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
/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/
let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Dan Brown',
    id: "afaf32fa-23232-afavva",
  }
]


let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
  {
    title: 'Angels and Demons',
    published: 2007,
    author: 'Dan Brown',
    id: "afaf32fa-23232-afavva",
    genres: 'mystery'
  }
]

/*
  you can remove the placeholder query once your first own has been implemented 
*/

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type Book {
    title: String!
    published: String
    author: String!
    id: ID!
    genres: String
  }

  type User {
    username: String!
    userBooks: [Book!]!
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
    allBooks(author: String, genres: String): [Book!]
    allAuthors: [Author!]!
    findBook(title: String!): Book
    me: User
  }

  type Mutation {
    addBook(
        title: String!
        published: String
        author: String!
        genres: [String]
    ): Book

    editPublished(
        title: String!
        published: String!
    ): Book

    editAuthor(
        name: String
        born: String
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
      return Book.find({})
    },
    allAuthors: () => {
      return Author.find({})
    },
    findBook: async (root, args) => {
      return Book.findOne({ title: args.title })
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: (root) => {
      const resultBooks = books.filter((book) => book.author === root.name)
      return resultBooks.length
    }
  },
  // Book: {
  //     author: ({ name, born }) => {
  //         return {
  //             name,
  //             born,
  //         }
  //     }
  // },
  Mutation: {
    addBook: async (root, args) => {
      // add current user
      const currentUser = context.currentUser
      const newBook = new Book({ ...args })

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

      try {
        await newBook.save()
        //add book to current user
        currentUser.userBooks = currentUser.userBooks.concat(newBook)
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
    editPublished: async (root, args) => {
      // const book = books.find(element => element.title === args.title)
      // if (!book) {
      //   return null
      // }

      // const updatedBook = { ...book, published: args.published }
      // books = books.map(element => element.title === args.title ? updatedBook : element)
      // return updatedBook

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
    editAuthor: (root, args) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      // find the index of the author to edit in the authors array
      const foundIndex = authors.findIndex(element => element.name === args.name)

      if (foundIndex === -1) {
        return null
      }

      // update the new born value in a new variable with the rest of the data spreaded
      const updatedAuthor = { ...authors[foundIndex], born: args.born }
      // update the original array
      authors = authors.map((element, specificIndex) => specificIndex === foundIndex ? updatedAuthor : element)
      return updatedAuthor
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
    addAsUserBooks: async (root, args, { currentUser }) => {
      const isSpecificUserBooks = (book) => {
        return currentUser.userBooks.map(element => element._id.toString()).includes(book._id.toString())
      }

      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const book = await Book.findOne({ title: args.title })
      if (!addAsUserBooks(book)) {
        currentUser.userBooks = currentUser.userBooks.concat(book)
      }

      await currentUser.save()
      return currentUser

    }
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
      const currentUser = await User.findById(decodedToken.id).populate('userBooks')
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


