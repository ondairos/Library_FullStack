import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

import {
    ApolloClient, InMemoryCache, gql, ApolloProvider
} from '@apollo/client'

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
    // The client can be made accessible for all components of the application by wrapping the App component with ApolloProvider
    <ApolloProvider client={client}>
        <Router>
            <App />
        </Router>
    </ApolloProvider>
)