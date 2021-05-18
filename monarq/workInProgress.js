import express from 'express';
import fetch from 'node-fetch'
import gql from 'graphql-tag';
import context from './graphql/context.js';

//ROUTE FUNCTION//

//Client may need to inlcude in the body of the request the variables defined in this manifest object, but it might be taken care of in the generatedQuery function

export const routerCreation = (
    schema, //Already defined schema
    execute, //the function that will execute the GraphQL Request (may need to generalize or have the client define)
    endPointObject, //from the manifest file (when routerCreation is invoked, will pass in the object from manifest)
    createdGQL //object that contains queries/mutations that were created with the previous function
    ) => {
    
    /*  Create instance of an expressRouter Object
        Grab the endpoints object from inside the manifest object
        Example: 
         */
            const router = express.Router();
        //*MAY NEED TO UNSTRINGIFY THE MANIFEST OBJECT WHEN IMPORTING *///


            const { endpoints } = endPointObject;
            //console.log('Endpoint Object: ', endpoints)


    /*  Loop though each endpoint in the endPointObject & loop through methods in the endpoint object 
    
         */

            Object.keys(endpoints).forEach(apiPath => {
                //console.log('apiPath: ', apiPath)

                Object.keys(endpoints[apiPath]).forEach(method => {

                    let currentQuery;

                    //loop through the query and mutation objects in the createdGQL object and see which key is the same as the operation in the manifest file
                    const  { query: queryObj, mutation: mutationObj } = createdGQL;

                    for (let query in queryObj) {
                        // console.log(query)
                        // console.log(endpoints[apiPath][method].operation)


                        if (query === endpoints[apiPath][method].operation){
                            currentQuery = queryObj[query]
                            //console.log(currentQuery)
                        }
                    }

                    for (let mutation in mutationObj) {
                        if (mutation === endpoints[apiPath][method].operation){
                            currentQuery = mutationObj[mutation]
                        }
                    }
            //will need to add in async
            //addRoutes Function adds the correct router to the instance of the express router as defined in the manifest and returns the router
                    addRoutes(
                        schema, 
                        execute, 
                        method, 
                        apiPath, 
                        currentQuery, 
                        router
                    );  

                }) //end of apiPath forEach

           }) //end of endpoint forEach


            // router.get('/', (req, res) => {
            //     console.log('hell0')
            // })
            // router.post('/', (req, res) => {
            //     console.log('hell0')
            // })



            //Lastly, return router
            //console.log(router.stack)
            return router
       

}

/////////////////////////////////
/////                       /////
/////    Helper Functions   /////
/////                       /////
/////////////////////////////////

//Function that will execute the GQL query 
async function executeOperation (execute, schema, gqlQuery, req, res) {
    // const { query, params, body } = req; 
    // //can add addition error logic/security here
    // const variables = {
    //     ...query, 
    //     ...params,
    //     ...body
    // }
    // console.log("THIS IS VARIABLES: ", variables)
    // console.log('IM ABOUT TO EXECUTE')
    // console.log(gqlQuery)
   //const inputQuery = gql(gqlQuery)
    //console.log(inputQuery)
    //console.log("REQ HEADERS: ", req.headers)
    //console.log('CONTEXT DB: ', context)
    // fetch('http://localhost:3000/graphql', {
//   method: 'post',
//   headers: { 'Content-Type': 'application/json' },
//   body:JSON.stringify({query}),
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))
//let response;

// await fetch('http://localhost:3000/graphql', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             query: gqlQuery,
//             variables: variables
//         })
//     }).then(data => data.json()).then(ressy => {
//         console.log('RESSY: ', ressy)
//         return Promise.resolve(ressy);
//     }).catch(err => console.log(err))

    // const response = await execute({
    //     query: inputQuery,
    //     variables: variables,
    //     context: context,
    // });// this will be figured out when connecting the graphql server to this function. thinking of using graphql-execute from graphql
//     fetch('http://localhost:3000/graphql', {
//   method: 'post',
//   headers: { 'Content-Type': 'application/json' },
//   body: gqlQuery,
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).then(sendThis => res = sendThis).catch(err => console.log(err))
    //response = JSON.parse(response)
    //console.log('RESPONSE FROM INSIDE EXECUTE OPERATION: ', response)
    //if (!response) throw new Error('query was not executed in executeOperation Function');
    //console.log('NOW LEAVING EXECUTE')
    //res = response
    //return response;
}




const addRoutes = (
    schema, 
    execute, 
    method, 
    apiPath, 
    GQLquery, 
    router
    
    ) => {
    
    switch (method.toLowerCase()) {
        case 'get': {
            router.get(apiPath, async (req, res) => {
            
                /* If the response is not an error object, then create a Rest Response Object with the data given from the GraphQL response object||
                            Example: will need to add in await */
                            
                             //will need to insert GQL query with the correct parameters and/or querys from req object
                    // let resp;
                    const { query, params, body } = req; 
                    //can add addition error logic/security here
                    const variables = {
                        ...query, 
                        ...params,
                        ...body
                    }
                    console.log("THIS IS VARIABLES: ", variables)
                    console.log('IM ABOUT TO GRAPHQL FETCH')
                    console.log(GQLquery)
                    
                    fetch('http://localhost:3000/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: GQLquery,
                            variables: variables
                        })
                    }).then(data => data.json()).then(ressy => {
                        console.log('RESSY: ', ressy)
                        res.body = ressy.data;
                        res.status(200).json(res.body)
                    }).catch(err => console.log(err))
                        
                            
                    
                            // if (!resp) {
                            //     console.log("THIS IS RESP THAT IS AN ERROR: ", resp)
                            //     throw new Error('invalid response from Execute Operation GET')
                            // }
                            //console.log(response)
                            
                            //console.log('THIS IS RES: ', res.row)
                            //res.status(200).json(res)
                            }) 

                            break;
        }

        case 'delete': {
            router.delete(apiPath, async (req, res) => {
            
                /* If the response is not an error object, then create a Rest Response Object with the data given from the GraphQL response object||
                            Example: will need to add in await */
                            
                            //will need to insert GQL query with the correct parameters and/or querys from req object
                           // let resp;
                    const { query, params, body } = req; 
                    //can add addition error logic/security here
                    const variables = {
                        ...query, 
                        ...params,
                        ...body
                    }
                    console.log("THIS IS VARIABLES: ", variables)
                    console.log('IM ABOUT TO GRAPHQL FETCH')
                    console.log(GQLquery)
                    
                    fetch('http://localhost:3000/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: GQLquery,
                            variables: variables
                        })
                    }).then(data => data.json()).then(ressy => {
                        console.log('RESSY: ', ressy)
                        res.body = ressy.data;
                        res.status(200).json(res.body)
                    }).catch(err => console.log(err))
                        
                            }) 
                            
                            break;
        }

        case 'post': {
            router.post(apiPath, async (req, res) => {
            
                /* If the response is not an error object, then create a Rest Response Object with the data given from the GraphQL response object||
                    Example: will need to add in await */
                            
                     //will need to insert GQL query with the correct parameters and/or querys from req object
                       // let resp;
                    const { query, params, body } = req; 
                    //can add addition error logic/security here
                    const variables = {
                        ...query, 
                        ...params,
                        ...body
                    }
                    console.log("THIS IS VARIABLES: ", variables)
                    console.log('IM ABOUT TO GRAPHQL FETCH')
                    console.log(GQLquery)
                    
                    fetch('http://localhost:3000/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: GQLquery,
                            variables: variables
                        })
                    }).then(data => data.json()).then(ressy => {
                        console.log('RESSY: ', ressy)
                        res.body = ressy.data;
                        res.status(200).json(res.body)
                    }).catch(err => console.log(err))
                        
                            }) 

                            break;
        }

        default: return;
    }
}

//console.log(routerCreation(fakeSchema, fakeExecute, manifest, generatedGQLQueries));

/* WHAT IS RETURNED:

    router.get('/user/:id', async (req, res) => {
        const response = await execute(schema, gqlQuery, variables);;

        res.status(200).send(res.data)
    })

    router.delete('/user/:id', async (req, res) => {
        const response = await execute(schema, gqlQuery, variables);;

        res.status(200).send(res.data)
    })

    router.post('/user/message', async (req, res) => {
        const response = await execute(schema, gqlQuery, variables);;

        res.status(200).send(res.data)
    })
}


server.js

const apiRoutes = routerCreation(schema, execute, manifest, GQLQueries)

app.use('/api', apiRoutes)
*/