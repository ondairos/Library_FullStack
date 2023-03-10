import { useState } from 'react'
import { useMutation } from '@apollo/client'
// eslint-disable-next-line no-unused-vars
import { ALL_BOOKS, CREATE_BOOK, ALL_AUTHORS } from '../queries'
import '../App.css'

import { updateCache } from '../App'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')

  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  // create book object from useMutation hook
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
    onError: (error) => {

      // const myTestObject = JSON.stringify(error)
      const errorMessageNow = error.graphQLErrors[0].message
      // const errors = error.graphQLErrors[0]
      // const messages = Object.values(errors).map(element => element.message).join('\n')
      props.setError(errorMessageNow)
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
    },
  })


  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    //use createBook from useMutation hook
    createBook({
      variables: { title, author, published: Number(published), genres }
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }


  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form className='addBook_form' onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook