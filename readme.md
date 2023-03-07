

# Fullstack Project with GraphQL and React

This codebase contains the client and server side for a web application that allows users to view and manage a collection of books and authors.
This project has two main parts: a client side and a server side. The client side is built using React and Apollo Client, while the server side is built with Apollo Server and MongoDB.

## Client Side

The client side is built using React, Apollo Client for GraphQL queries and mutations, and React Router for navigation. The main components are:

- `Authors`: Displays a list of authors and their information.
- `Books`: Displays a list of books and their information.
- `NewBook`: Allows users to add a new book to the collection.
- `Notify`: Displays error messages to users.
- `EditPublishDateForm`: Allows users to edit the publish date of a book.
- `LoginForm`: Allows users to log in to the application.

The main functionality of the client side includes:

- Querying and displaying a list of books and their authors.
- Adding new books to the collection.
- Editing the publish date of a book.
- Logging in to the application.

## Server Side

The server side is built using Apollo Server for GraphQL queries and mutations, and Express for the web server. The main components are:

- `User`: Represents a user of the application.
- `typeDefs`: Defines the GraphQL schema for the application.
- `resolvers`: Defines the GraphQL resolvers for the application.

The main functionality of the server side includes:

- Querying and mutating data related to books and authors.
- Authenticating users using JWT tokens.

## Running the Application

To run the application, follow these steps:

1. Clone this repository to your local machine.
2. Run `npm install` in the root directory to install the required dependencies.
3. Start the server by running `npm run start:server` in the root directory.
4. Start the client by running `npm start` in the `client` directory.
5. Navigate to `http://localhost:3000` in your web browser to use the application.


## Author
- Ioannis Kantiloros for the FullStackOpen part 8 exercises
- FullStack Open[https://fullstackopen.com]
