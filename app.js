import express from 'express';
import graphqlServer from './graphql';
import { graphql } from 'graphql';
import schema from './graphql/schema';
import context from './graphql/context.js';

//STEP 1 
import { routerCreation, queryMap } from 'monarq';


//STEP 3
import { manifest } from './dummyManifestAndQueryObj.js';
//const manifest = {}


const app = express();
app.use(express.json());


//STEP 4
//will need to have user define this executeFunction cause the middleware will execute the graphql query with these 4 arguments passed in
async function executeFn (str, variableObj, schema, context){
  
  const newContext = await context();
  
  const data = await graphql(
    schema, 
    str,
    null,
    newContext,
    variableObj
  );

  return (data || errors);
}


// STEP 1
const createdQuery = queryMap(manifest, schema);

// STEP 2
const apiRouter = routerCreation(manifest, createdQuery, {
  schema, 
  context,
  executeFn
});

// STEP 3
app.use('/api', apiRouter)


graphqlServer.applyMiddleware({
  app
});

export default app;














/* USER OF NPM PACKAGE TODOs

  1. Download NPM Package which will add file into your root directory of project
  2. Define the manifest object in the file
  3. Import Manifest Object into you express server (where you invoked express)
  4. Create Wrapped function that executes the GraphQL query based on the GraphQL server you run.
      -the wrapped function must have 4 arguments in this order: query, variables, schema, context and have the values passed in to the graphql's server accordingly
  5. invoked createQuery function and save into a variable
      -ex: const queryObject = createQuery(schema, manifest);
  6. invoked routeCreation function and save as a variable
      -ex: const restRouter = routeCreation(manifest, queryObject, {schema, context, executeFn})
  7. App.Use to an endpoint you designate with the restRouter as the middleware that will take care of it
      -ex: app.use('<DESIGNATE ENDPOINT FOR ALL REST REQUEST TO GO TO>', restRouter)
*/