import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
query {
  allBooks {
    title,
    published,
    author,
    id
  }
}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
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
mutation AddBook($title: String!, $author: String!, $published: String) {
  addBook(title: $title, author: $author, published: $published) {
    title,
    author,
    published
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