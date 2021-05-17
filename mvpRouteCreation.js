import express from 'express';
import fetch from 'node-fetch';

//ROUTE FUNCTION//

export const routerCreation = (
    endPointObject, //from the manifest file (when routerCreation is invoked, will pass in the object from manifest)
    createdGQL //object that contains queries/mutations that were created with the previous function
) => {

    const router = express.Router();

    //*MAY NEED TO UNSTRINGIFY THE MANIFEST OBJECT WHEN IMPORTING *//
    const { endpoints } = endPointObject;

    Object.keys(endpoints).forEach(apiPath => {

        Object.keys(endpoints[apiPath]).forEach(method => {

            let currentQuery;
            //console.log(createdGQL)

            for (let query in createdGQL) {
                if (query === endpoints[apiPath][method].operation) {
                    currentQuery = createdGQL[query]
                }
            }
            console.log("CURRENT QUERY: ", currentQuery);
            // for (let query in queryObj) {

            //     if (query === endpoints[apiPath][method].operation) {
            //         currentQuery = queryObj[query];
            //     }
            // }

            // for (let mutation in mutationObj) {
            //     if (mutation === endpoints[apiPath][method].operation) {
            //         currentQuery = mutationObj[mutation];
            //     }
            // }

            //HELPER FUNCTION INVOKED
            addRoutes(
                method,
                apiPath,
                currentQuery,
                router
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

const addRoutes = (
    method,
    apiPath,
    GQLquery,
    router
) => {

    switch (method.toLowerCase()) {
        case 'get': {
            router.get(apiPath, async (req, res) => {

                const { query, params, body } = req;
                //can add addition error logic/security here
                const variables = {
                    ...query,
                    ...params,
                    ...body
                };

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
                }).catch(err => console.log(err));

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

            });

            break;
        }

        default: return;
    }
}

