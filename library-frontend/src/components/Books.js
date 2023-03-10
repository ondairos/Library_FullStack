import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { FIND_SPECIFIC_BOOK } from '../queries'

//book compo
const Book = ({ book, onClose }) => {

  if (!book) {
    return null;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <div>
        {book.author} {book.published}
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
    console.log(`Title to searchresult inside books component: ${titleSearchResult}`);
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
          {/* {console.log(`props books: ${JSON.stringify(props.books)}`)} */}
          {props.books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
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
