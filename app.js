import express from 'express';
import graphqlServer from './graphql';
import { routerCreation } from './mvpRouteCreation.js';
import { manifest } from './dummyManifestAndQueryObj.js';
import queryObject from './wip.js';
import schema from './graphql/schema'

const app = express();
app.use(express.json())

const createdQuery = queryObject(manifest)
console.log(createdQuery)
//STEP 5
const apiRouter = routerCreation(manifest, createdQuery);

//STEP 6
app.use('/api', apiRouter)


graphqlServer.applyMiddleware({
  app
});

export default app;



/* USER OF NPM PACKAGE TODOs

  1. Download NPM Package which will add file into your root directory of project
  2. Define the manifest object in the file
  3. Import Manifest Object into you express server (where you invoked express)
  4. invoked createQuery function and save into a variable
      -ex: const queryObject = createQuery(schema, manifest);
  5. invoked routeCreation function and save as a variable
      -ex: const restRouter = routeCreation(manifest, queryObject)
  6. App.Use to an endpoint you designate with the restRouter as the middleware that will take care of it
      -ex: app.use('<DESIGNATE ENDPOINT FOR ALL REST REQUEST TO GO TO>', restRouter)
*/