//NOTE USER OF NPM PACKAGE WILL NEED TO DO THIS WRAPPER FUNCTION (IF WE CAN GET EXECUTE TO RUN INSIDE THE MIDDLEWARE)
// const executeFn = ({ query, variables, context }) => {
//   return execute({
//       schema,
//       document: query,
//       variableValues: variables,
//       contextValue: context,
//       rootValue: resolvers
//   });
// }

//USER OF NPM PACKAGE WOULD DEFINE THIS MANIFEST OBJECT
//STEP 2
export const manifest = {
    endpoints: {
      //INSERT API PATH HERE 
      '/book/:id':{
        //METHOD:
        get:{
          operation: 'book',
        },
        post: {
          operation: 'updateBook',
        }
      },
      '/books': {
        post: {
          operation: 'books',
          defaultParams: {
            pageSize: 20,
            page: 1
          }
        }
      },
      '/author': {
        get: {
          operation: 'author',
        }
      }
    }
  }

//   {
//     updateBook: {
//       id: ID!,
//       name: String
//     },
//     book: {
//       id: ID!
//     }
//   }

// {  
//   updateBook: [id, name],
//   author: ['id']
// }

  // FOR REFERENCE / TESTING ONLY
  //RETURNED OBJECT FROM CREATE QUERY FUNCTION
  // export const createdQuery = {
  //   query: {
  //     book: `query ($id: ID!)  {
  //       book(id: $id){
  //         id
  //         name
  //         author{
  //           id
  //           name
  //         }
  //       }
  //     }`,
      
  //     books: `query {
  //       books{
  //         results{
  //           id
  //           name
  //         }
  //       }
  //     }`,
  //     author: `query ($id: ID!) {
  //       author(id: $id){
  //         id
  //         name
  //       }
  //     }`
  //   },
  //   mutation: {
  //     updateBook: `mutation($id: ID!, $book: BookUpdateInput!) {
  //       updateBook (id: $id, book: $book) {
  //         id
  //         name
  //         author {
  //           id
  //           name
  //         }
  //       }
  //     }`
  
  //   }
  // }