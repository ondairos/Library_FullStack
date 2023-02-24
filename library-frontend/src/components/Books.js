// import { gql, useQuery } from '@apollo/client'

// const findSpecificBook = gql`  
// query FindBook($title: String!) {
//   findBook(title: $title) {
//     title
//     author
//     genres
//   }
// }
// `


const Books = (props) => {
  // if (props.books.show) {
  //   console.log('no show show!')
  //   return null
  // }

  // const books = []

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
