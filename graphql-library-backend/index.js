const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')

// mongoose
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')

// dotenv
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
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
  }

  type Book {
    title: String!
    published: String
    author: String!
    id: ID!
    genres: String
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
  }

  type Mutation {
    addBook(
        title: String!
        published: String
        author: String!
        genres: String
    ): Book
    editPublished(
        title: String!
        published: String!
    ): Book
    editAuthor(
        name: String
        born: String
    ): Author
  }
`

const resolvers = {
  Query: {
    // bookCount: () => books.length,
    bookCount: (root) => {
      return books.length
    },

    authorCount: () => authors.length,
    // allBooks: () => books,
    // allBooks: (root, args) => {
    //     if (!args.author) {
    //         return books
    //     }
    //     const byAuthor = (book) => {
    //         return args.author === 'YES' ? book.author : !book.author
    //     }
    //     return books.filter(byAuthor)

    // },
    allBooks: (root, args) => {
      if (!args.genres) {
        return books
      }
      // This function filters the books array based on the genre provided as an argument and then returns the filtered list of books, with the author's name.
      return books.filter(book => book.genres.includes(args.genres)).map(book => {
        const author = authors.find(author => author.name === book.author)
        return {
          ...book,
          author: author.name
        }
      })
    },
    allAuthors: () => {
      return authors
    },
    findBook: (root, args) => {
      const foundBook = books.find(element => element.title === args.title)
      return foundBook || null
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
    addBook: (root, args) => {

      // error here
      if (books.find(element => element.title === args.title)) {
        throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      const newBook = { ...args, id: uuid() }
      books = books.concat(newBook)
      return newBook
    },
    editPublished: (root, args) => {
      const book = books.find(element => element.title === args.title)
      if (!book) {
        return null
      }

      const updatedBook = { ...book, published: args.published }
      books = books.map(element => element.title === args.title ? updatedBook : element)
      return updatedBook
    },
    editAuthor: (root, args) => {
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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


