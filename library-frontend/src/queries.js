import { gql } from '@apollo/client'

// fragment for book details
const BOOK_DETAILS_FRAG = gql`
  fragment BookDetails on Book {
    id
    title
    genres
    published
    author{
      id
      name
      born
      bookCount
    }
  }
`

const AUTHOR_DETAIL_FRAG = gql`
  fragment AuthorDetail on Author {
    id
    name
    born
    bookCount
  }
`


export const ALL_BOOKS = gql`
query allBooks($genres: String, $author:String){
  allBooks(genres: $genres, author: $author) {
    ...BookDetails
  }
}
${BOOK_DETAILS_FRAG}
`


export const ALL_AUTHORS = gql`
query {
  allAuthors {
    ...AuthorDetail
  }
}
${AUTHOR_DETAIL_FRAG}
`

export const FIND_SPECIFIC_BOOK = gql`  
query FindBook($titleToSearch: String!) {
  findBook(title: $titleToSearch) {
    title
    author {
      name
    }
    published
  }
}
`

export const CREATE_BOOK = gql`
mutation AddBook($title: String!, $author: String!, $published: Int!, $genres:[String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    id
    author {
      id
      name
      born
      bookCount
    }
    published
    genres
  }
}
`

export const EDIT_PUBLISH_DATE = gql`
mutation EditPublished($title: String!, $published: Int!) {
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

//book added subscription
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS_FRAG}
`