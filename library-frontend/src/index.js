import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { setContext } from '@apollo/client/link/context'

import {
    ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split
} from '@apollo/client'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
})

//websocket link
const wsLink = new GraphQLWsLink(
    createClient({ url: 'ws://localhost:4000' })
)

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('booksandauthors-user-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null,
        }
    }
})

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        )
    },
    wsLink,
    authLink.concat(httpLink)
)

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink
})

ReactDOM.createRoot(document.getElementById('root')).render(
    // The client can be made accessible for all components of the application by wrapping the App component with ApolloProvider
    <ApolloProvider client={client}>
        <Router>
            <App />
        </Router>
    </ApolloProvider>
)