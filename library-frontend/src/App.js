import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Notify } from './components/Notify'
import { useApolloClient, useQuery, useMutation, useSubscription } from '@apollo/client'
// react router
// eslint-disable-next-line no-unused-vars
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED } from './queries'
import { EditPublishDateForm } from './components/EditPublishDateForm'
// css
import './App.css'
import { LoginForm } from './components/LoginForm'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const result = useQuery(ALL_BOOKS)

  //notify function to setError to state and remove the notification after 8000secs
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => { setErrorMessage(null) }, 8000)
  }

  //useSubscription
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  // home component
  const Home = () => {
    return (
      <div>
        <h1>Main Page</h1>
        <hr></hr>
        <h2>Books and Authors</h2>
        <hr></hr>
      </div>
    )
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  // logout
  const logout = () => {
    setToken(null)
    // clear localstorage
    localStorage.clear()
    //clear cache
    client.resetStore()
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <div>
      <div>
        <div className='app_bar'>
          <Link to='/' className='linkButton'>Home </Link><span>||</span>
          <Link to='/authors' className='linkButton'>Authors </Link><span>||</span>
          <Link to='/books' className='linkButton'>Books </Link><span>||</span>
          <Link to='/add' className='linkButton'>Add </Link><span>||</span>
          <Link to='/edit' className='linkButton'>Edit Publish Date </Link><span>||</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <Notify errorMessage={errorMessage}></Notify>

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/books' element={<Books books={result.data.allBooks} />}></Route>
        <Route path='/add' element={<NewBook setError={notify} />}></Route>
        <Route path='/edit' element={<EditPublishDateForm setError={notify} />}></Route>
        <Route path='/authors' element={<Authors />}></Route>
      </Routes>
    </div>
  )
}

export default App
