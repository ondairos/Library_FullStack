import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const FIND_SPECIFIC_BOOK = gql`  
query FindBook($titleToSearch: String!) {
  findBook(title: $titleToSearch) {
    title
    author
    genres
  }
}
`

//book compo
const Book = ({ book, onClose }) => {
  return (
    <div>
      <h2>{book.title}</h2>
      <div>
        {book.author}  ||Genres: {book.genres}
      </div>
      <div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

const Books = (props) => {
  const [titleToSearch, setTitleToSearch] = useState(null)
  const titleSearchResult = useQuery(FIND_SPECIFIC_BOOK, {
    variables: { titleToSearch },
    skip: !titleToSearch
  })


  // conditional rendering
  if (titleToSearch && titleSearchResult.data) {
    return (
      <Book
        book={titleSearchResult.data.findBook}
        onClose={() => setTitleToSearch(null)}
      />
    )
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
              <td><button onClick={() => setTitleToSearch(a.title)}>Show Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
