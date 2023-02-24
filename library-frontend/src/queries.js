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
