import express from 'express';
import graphqlServer from './graphql';
import { routerCreation } from './workInProgress';
import { execute } from 'graphql';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers'

const app = express();
app.use(express.json())

//FIRST FUNCTION WOULD BE INVOKED!

//NOTE USER OF NPM PACKAGE WILL NEED TO DO THIS WRAPPER FUNCTION
const executeFn = ({ query, variables, context }) => {
  return execute({
      schema,
      document: query,
      variableValues: variables,
      contextValue: context,
      rootValue: resolvers
  });
}

const manifest = {
  endpoints: {
    //INSERT API PATH HERE 
    '/book/:id':{
      //METHOD:
      get:{
        operation: 'book'
      },
      post: {
        operation: 'updateBook'
      }
    },
    '/author': {
      get: {
        operation: 'author'
      }
    }
  }
}

//RETURNED OBJECT FROM HER FUNCTION
const createdQuery = {
  query: {
    book: `query ($id: ID!)  {
      book(id: $id){
        id
        name
        author{
          id
          name
        }
      }
    }`,
    
    author: `query ($id: ID!) {
      author(id: $id){
        id
        name
      }
    }`
  },
  mutation: {
    updateBook: `mutation($id: ID!, $book: BookUpdateInput!) {
      updateBook (id: $id, book: $book) {
        id
        name
        author {
          id
          name
        }
      }
    }`

  }
}

const apiRouter = routerCreation(schema, executeFn, manifest, createdQuery);

app.use('/api', apiRouter)

//METHOD: 'GET', ENDPOINT: '/api/user/:id'



graphqlServer.applyMiddleware({
  app
});

export default app;



/* TODO

  1. import schema-DONE
  2. import execute function from graphql-DONE
  3. create dummy manifest based on schema inputs
  4. create dummy createdQuery object (Which in reality would be returned from the frist function)



*/