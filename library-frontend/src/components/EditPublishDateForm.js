import React, { useEffect, useState } from 'react'
import { EDIT_PUBLISH_DATE } from '../queries'
import { useMutation } from '@apollo/client'

export const EditPublishDateForm = () => {
  const [published, setPublished] = useState('')
  const [title, setTitle] = useState('')

  //Init edit publish date of book Mutation with GraphQL
  const [changePublishDate, result] = useMutation(EDIT_PUBLISH_DATE)

  const submit = async (event) => {
    event.preventDefault()

    changePublishDate({ variables: { title, published } })
    setTitle('')
    setPublished('')
  }

  //todo with setError notify
  useEffect(() => {
    if(result.data && result.data.editPublished === null) {
      console.log('book not found!')
    }
  }, [result.data])

  return (
    <div>
      <h2>Change Publish Date</h2>

      <form onSubmit={submit}>
        <div>
          Title: <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Publish Date: <input
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <button type='submit'>Change Publish Date</button>
      </form>
    </div>
  )
}
