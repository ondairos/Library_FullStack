import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client'



const ALL_BOOKS = gql`
query {
    allBooks {
        title,
        published,
        author,
        id
    }
}
`



const App = () => {
  const [page, setPage] = useState('authors')
  const result = useQuery(ALL_BOOKS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <div>
          {/* {result.data.allBooks.map(book => book.title).join(', ')} */}
        </div>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App