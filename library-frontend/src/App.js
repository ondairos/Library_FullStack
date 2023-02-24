import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Notify } from './components/Notify'

import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')

  const [errorMessage, setErrorMessage] = useState(null)

  const result = useQuery(ALL_BOOKS)

  //notify function to setError to state and remove the notification after 8000secs
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => { setErrorMessage(null) }, 8000)
  }

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

        </div>
      </div>

      <Notify errorMessage={errorMessage}></Notify>
      <Authors show={page === 'authors'} />

      {/* <Books show={page === 'books'} books={result.data.allBooks} /> */}
      <Books show={page === 'books'} books={result.data.allBooks} />

      <NewBook show={page === 'add'} setError={notify} />
    </div>
  )
}

export default App
