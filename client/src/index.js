import "@babel/polyfill";
import React from 'react';
import { render } from 'react-dom';
import ApolloClient from "apollo-boost";
import {ApolloProvider} from 'react-apollo';
import App from './app';

//the client gives the url to our server to make requests
const client = new ApolloClient({
  uri: "http://localhost:4000"
});

const rootEl = document.getElementById('root');

//wrap whole application in ApolloProvider to have access to client
//in react application
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
   rootEl);

