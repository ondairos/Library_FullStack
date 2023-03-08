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
    likesToUser: [User!]!
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

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs