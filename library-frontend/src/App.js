import { useState } from 'react'
// import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Notify } from './components/Notify'
import { useQuery } from '@apollo/client'
// react router
// eslint-disable-next-line no-unused-vars
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { ALL_BOOKS, ALL_AUTHORS } from './queries'
import { EditPublishDateForm } from './components/EditPublishDateForm'
// css
import './App.css'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const result = useQuery(ALL_BOOKS)
  // const resultAuthors = useQuery(ALL_AUTHORS)

  //notify function to setError to state and remove the notification after 8000secs
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => { setErrorMessage(null) }, 8000)
  }

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

  return (
    <div>
      <div>
        <div className='app_bar'>
          <Link to='/' className='linkButton'>Home </Link><span>||</span>
          <Link to='/authors' className='linkButton'>Authors </Link><span>||</span>
          <Link to='/books' className='linkButton'>Books </Link><span>||</span>
          <Link to='/add' className='linkButton'>Add </Link><span>||</span>
          <Link to='/edit' className='linkButton'>Edit Publish Date </Link><span>||</span>
        </div>
      </div>

      {/* {resultAuthors && <Authors show={page === 'authors'} authors={resultAuthors.data.allAuthors} />} */}
      <Notify errorMessage={errorMessage}></Notify>

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/books' element={<Books books={result.data.allBooks} />}></Route>
        {/* <Route path='/authors' element={<Authors authors={resultAuthors.data.allAuthors} />}></Route> */}
        <Route path='/add' element={<NewBook setError={notify} />}></Route>
        <Route path='/edit' element={<EditPublishDateForm setError={notify} />}></Route>
      </Routes>
    </div>
  )
}

export default App
