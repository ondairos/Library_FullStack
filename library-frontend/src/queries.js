import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
query {
  allBooks {
    id
    title
    genres
    published
    author {
      name
    }
  }
}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    id
    name
    born
    bookCount
  }
}
`

export const FIND_SPECIFIC_BOOK = gql`  
query FindBook($titleToSearch: String!) {
  findBook(title: $titleToSearch) {
    title
    author
    published
  }
}
`

export const CREATE_BOOK = gql`
mutation AddBook($title: String!, $author: String!, $published: String, $genres:[String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    author {
      name
    }
    published
    genres
    id
  }
}
`

export const EDIT_PUBLISH_DATE = gql`
mutation EditPublished($title: String!, $published: String!) {
  editPublished(title: $title, published: $published) {
    title
    published
    id
  }
}
`

// login
export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password){
    value
  }
}
`