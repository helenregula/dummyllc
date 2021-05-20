import express from 'express';
//import { graphql } from 'graphql';
import fetch from 'node-fetch';
// import context from '../graphql/context.js';
// import schema from '../graphql/schema.js';


export const routerCreation = (
    manifest, //from the manifest file 
    createdGQL, //object that contains queries/mutations that were created with the previous function
    infoForExecution //object that will have three keys- schema, context and wrapper function that will execute the graphql query
) => {

    const router = express.Router();

    //*MAY NEED TO UNSTRINGIFY THE MANIFEST JSON OBJECT WHEN IMPORTING *//
    let endPointObj = validateManifest(manifest)


    const { endpoints } = endPointObj;

    Object.keys(endpoints).forEach(apiPath => {

        Object.keys(endpoints[apiPath]).forEach(method => {

            let currentQuery;

            for (let query in createdGQL) {
                if (query === endpoints[apiPath][method].operation) {
                    currentQuery = createdGQL[query]
                }
            }

            if (!currentQuery) throw new Error('Manifest Obj \'s Operation Field Doesn\'t match Valid Query or Mutation in Schema. Operation Field is Mandatory in Manifest Obj for every method. Check the operation field in the Manifest Object')

            let { requiredVariables } = endpoints[apiPath][method];
            //console.log(requiredVariables)

            addRoutes(
                method,
                apiPath,
                currentQuery,
                router,
                requiredVariables,
                infoForExecution
            );

        });

    });

    return router
}

/////////////////////////////////
/////                       /////
/////    Helper Functions   /////
/////                       /////
/////////////////////////////////
const validateManifest  = manifestObj => {
    if (Object.keys(manifestObj).length < 1) throw new Error('manifest is not defined in routeCreation function. Please check documentation on how to pass in the manifest properly');

    return manifestObj;
}

const populateVariables = (requiredVariables, queryReq, paramsReq, bodyReq) => {
    if (!requiredVariables) return;

    let variables = {};


    if (Object.keys(queryReq).length !== 0) {
        requiredVariables.forEach(vari => {
            if (queryReq[vari]) {
                variables[vari] = queryReq[vari];
            }
        })
    }

    if (Object.keys(paramsReq).length !== 0) {
        requiredVariables.forEach(vari => {
            if (paramsReq[vari]) {
                variables[vari] = paramsReq[vari];
            }
        })
    }

    if (Object.keys(bodyReq).length !== 0) {
        requiredVariables.forEach(vari => {
            if (bodyReq[vari]) {
                variables[vari] = bodyReq[vari];
            }
        })
    }

    return Object.keys(variables).length > 0 ? variables: 'Client Must Follow Required Variable Guidelines';
}


const addRoutes = (
    method,
    apiPath,
    GQLquery,
    router,
    requiredVariables,
    infoForExecution
) => {

    switch (method.toLowerCase()) {
        case 'get': {
            router.get(apiPath, async (req, res) => {

                const { query, params, body } = req;
                //can add addition error logic/security here
                //let variables = populateVariables(requiredVariables, query, params, body);

                const variables = {
                    ...query,
                    ...params,
                    ...body
                };
                console.log(variables)
                // fetch('http://localhost:3000/graphql', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({
                //         query: GQLquery,
                //         variables: variables
                //     })
                // }).then(data => data.json()).then(responseGQL => {
                //     res.locals.response = responseGQL;
                //     return res.status(200).json(res.locals.response)
                // }).catch(err => console.log(err));


                const response = await infoForExecution.executeFn(GQLquery, variables, infoForExecution.schema, infoForExecution.context)
                if (response.errors) {
                    
                    res.status(500).json('Issue executing query, please check documenation on how to invoke the query function')
                    throw new Error(`${response.errors}`)
                    
                }

                res.locals.data = response;

               return res.status(200).json(res.locals.data)
            })

            break;
        }

        case 'delete': {
            router.delete(apiPath, async (req, res) => {

                const { query, params, body } = req;
                //can add addition error logic/security here
                const variables = {
                    ...query,
                    ...params,
                    ...body
                };

                // fetch('http://localhost:3000/graphql', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({
                //         query: GQLquery,
                //         variables: variables
                //     })
                // }).then(data => data.json()).then(responseGQL => {
                //     res.locals.response = responseGQL;
                //     return res.status(200).json(res.locals.response)
                // }).catch(err => console.log(err))

                const response = await infoForExecution.executeFn(GQLquery, variables, infoForExecution.schema, infoForExecution.context)
                if (response.errors) {
                    
                    res.status(500).json('Issue executing query, please check documenation on how to invoke the query function')
                    throw new Error(`${response.errors}`)
                    
                }

                res.locals.data = response;

               return res.status(200).json(res.locals.data)
            });

            break;
        }

        case 'post': {
            router.post(apiPath, async (req, res) => {

                const { query, params, body } = req;
                //can add addition error logic/security here
                const variables = {
                    ...query,
                    ...params,
                    ...body
                }

                // fetch('http://localhost:3000/graphql', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({
                //         query: GQLquery,
                //         variables: variables
                //     })
                // }).then(data => data.json()).then(responseGQL => {
                //     res.locals.response = responseGQL;
                //     return res.status(200).json(res.locals.response)
                // }).catch(err => console.log(err))

                const response = await infoForExecution.executeFn(GQLquery, variables, infoForExecution.schema, infoForExecution.context)
                if (response.errors) {
                    
                    res.status(500).json('Issue executing query, please check documenation on how to invoke the query function')
                    throw new Error(`${response.errors}`)
                    
                }

                res.locals.data = response;

               return res.status(200).json(res.locals.data)

            });

            break;
        }

        case 'put': {
            router.put(apiPath, async (req, res) => {

                const { query, params, body } = req;
                //can add addition error logic/security here
                const variables = {
                    ...query,
                    ...params,
                    ...body
                }

                // fetch('http://localhost:3000/graphql', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({
                //         query: GQLquery,
                //         variables: variables
                //     })
                // }).then(data => data.json()).then(responseGQL => {
                //     res.locals.response = responseGQL;
                //     return res.status(200).json(res.locals.response)
                // }).catch(err => console.log(err))

                const response = await infoForExecution.executeFn(GQLquery, variables, infoForExecution.schema, infoForExecution.context)
                if (response.errors) {
                    
                    res.status(500).json('Issue executing query, please check documenation on how to invoke the query function')
                    throw new Error(`${response.errors}`)
                    
                }

                res.locals.data = response;

               return res.status(200).json(res.locals.data)

            });

            break;
        }

        case 'patch': {
            router.patch(apiPath, async (req, res) => {

                const { query, params, body } = req;
                //can add addition error logic/security here
                const variables = {
                    ...query,
                    ...params,
                    ...body
                }

                // fetch('http://localhost:3000/graphql', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({
                //         query: GQLquery,
                //         variables: variables
                //     })
                // }).then(data => data.json()).then(responseGQL => {
                //     res.locals.response = responseGQL;
                //     return res.status(200).json(res.locals.response)
                // }).catch(err => console.log(err))

                const response = await infoForExecution.executeFn(GQLquery, variables, infoForExecution.schema, infoForExecution.context)
                if (response.errors) {
                    
                    res.status(500).json('Issue executing query, please check documenation on how to invoke the query function')
                    throw new Error(`${response.errors}`)
                    
                }

                res.locals.data = response;

               return res.status(200).json(res.locals.data)

            });

            break;
        }

        default: throw new Error('Operation Doesn\'t match the HTTP Methods allowed for this NPM Package, Please see documentation on which HTTP Methods are allowed and/or check the Manifest Object');
    }
}