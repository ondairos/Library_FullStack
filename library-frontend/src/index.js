import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { setContext } from '@apollo/client/link/context'

import {
    ApolloClient, InMemoryCache, ApolloProvider, createHttpLink
} from '@apollo/client'


const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('booksandauthors-user-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null,
        }
    }
})


const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})

ReactDOM.createRoot(document.getElementById('root')).render(
    // The client can be made accessible for all components of the application by wrapping the App component with ApolloProvider
    <ApolloProvider client={client}>
        <Router>
            <App />
        </Router>
    </ApolloProvider>
)