// note: was not able to use the import syntax, but the const + require language did work
// import { graphql, buildSchema, makeExecutableSchema } from 'graphql'
const graphql = require('graphql');
const path = require('path');
const fs = require('fs');
import schemaLLC from '../graphql/schema.js'

// user will designate REST endpoints, but assumption is that a GQL operation already exists for each one
  // error handling - if an invalid/non-existent operation is specified
// we need to create a list of all the queries that match up with a specific endpoint
  // look up the operation value within the schema file and compose the GQL query
  // assumption: any operation being used for a REST endpoint will have its "fully expanded" query returned (e.g., every scalar field) and it cannot contain nested references (? - TBD) 
  // need to handle and have placeholders for parameter fields when necessary
  // whether these are stored in multiple files or one file can be determined later
// this list of queries will then be referenced by the middleware based on the REST request received
  // look up the path of the request (either within the manifest file or directly on the file that has the query operations) to find the corresponding query
  // pass the query into the execution function

const manifest = {
  "endpoints": {
    "/users": {
      "get": {
        "operation": "users"
      }
    },
    "/users/me": {
      "get": {
        "operation": "me"
      },
      "post": {
        "operation": "deleteUser"
      }
    },
    "/posts": {
      "get": {
        "operation": "posts"
      }
    }
  }
};


// const endpoints = manifest.endpoints
// console.log('endpoints obj', endpoints)

// for(const key1 in endpoints) {
//   console.log('path: ', key1)
//   console.log('type: ', endpoints[key1])
//   console.log('operation', endpoints[key1].operation)
//   for(const key2 in endpoints[key1]) {
//     console.log('operation: ', endpoints[key1][key2].operation)
//   }
// } 



const schemaStr = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(
      title: String!
      body: String!
      published: Boolean!
      author: ID!): Post!
    deletePost(id: ID!): Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }
`

const schemaTest = graphql.buildSchema(schemaStr);
const schema = schemaLLC;
// console.log(schema.getType('CreateUserInput').getFields());

// console.log('schema query type: ', schema.getQueryType()) // this is not helpful, just returns 'Query'
// console.log('schema query fields: ', schema.getQueryType().getFields())
// console.log('users fields: ', schema.getQueryType().getFields().users)
// console.log('users fields type: ', schema.getQueryType().getFields().users.type)
// console.log('inspect on users fields type: ', schema.getQueryType().getFields().users.type.inspect())
// const currType = schema.getQueryType().getFields().users.type.inspect();
// console.log('get fields for a custom type', schema.getType('User').getFields())
// console.log('get type of operation by name: ', schema.getType('users').getFields()) // this does not work for Query/Mutation/Subscription types
// const schema2 = graphql.buildSchema(path.resolve(__dirname, './src/schema.graphql'))

const scalarTypes = ['String', 'Int', 'ID', 'Boolean', 'Float']
// in order to look up each operation, need to check the keys within the schema.getQueryType() and schema.getMutationType() objects
// if type is not scalar, then need to:
  // insert a new object   
  // look up the fields of the custom type by name
    // iterate through the keys of the custom type object
      // if key.type is scalar, then add key to the query
      // if key.type is not scalar, then need to:
        // repeat the process of opening new object and looking up the fields (maybe recursive call?)
        
// schema types
// query
// mutation
// custom types

/************************** 
***** HELPER FUNCTIONS ****
***************************/

// converts custom type text to simple strings (removes [] and !)
function typeTrim(type) {
  const typeArr = type.split('');
  const trimArr = [];
  for(let i = 0; i < typeArr.length; i++) {
    if(typeArr[i] !== '[' && typeArr[i] !== ']' && typeArr[i] !== '!') {
      trimArr.push(typeArr[i])
    }
  }
  return trimArr.join('');
}

/* recursive function which collects all of the fields associated with a type; if the field is scalar type, it adds to the return object;
if the field is a custom type, the function is invoked again on that field's schema fields continues recursively until only scalar types are found;
this function ignores situations where a custom type has itself as a field, as this provides duplicative information & causes endless loops */
function grabFields(customSchemaType, schemaObj) {
  let returnObj = {};
  for(const key in schemaObj) {
    let typeString = typeTrim(schemaObj[key].type.toString());
    if(scalarTypes.includes(typeString)) returnObj[key] = '';
    else {
      if(typeString !== customSchemaType.toString()) {
      returnObj[key] = grabFields(typeString, schema.getType(typeString).getFields());
      }
    }
  }
  return returnObj;
}

// testing the recursive function
let querySchema = schema.getQueryType().getFields();
// let mutationSchema = schema.getMutationType().getFields();
// let userSchema = schema.getType('User').getFields();
// let postSchema = schema.getType('Post').getFields();


console.log('overall query schema', meSchema);
// console.log('overall mutation schema', mutationSchema.createPost.args);
// console.log('createUser args', mutationSchema.createUser.args);
// console.log('users args', meSchema.users.args);
// console.log('User schema', userSchema);
// console.log('Post schema', postSchema);
// console.log('recursive check', grabFields('User', userSchema));

// convert the query to string version; called recursively if there are nested type objs
function buildString(fieldsObj) {
  const queryArr = [];
  for(const key in fieldsObj) {
    queryArr.push(key);
    if(fieldsObj[key] !== '') {
      queryArr.push('{');
      queryArr.push(buildString(fieldsObj[key]));
      queryArr.push('}');
    };
  };
  return queryArr.join(' ');
};

// function buildString(fieldsObj, joinChar) {
//   const queryArr = [];
//   for(const key in fieldsObj) {
//     queryArr.push(key);
//     if(fieldsObj[key] !== '') {
//       queryArr.push('{');
//       queryArr.push(buildString(fieldsObj[key]));
//       queryArr.push('}');
//     };
//   };
//   return queryArr.join(joinChar);
// };

// collects all of the arguments, handling all potential cases:
// 1) single scalar arg
// 2) multiple scalar args
// 3) custom input types as args
function grabArgs(argsArr) {
  const returnObj = {};
  for(let i = 0; i < argsArr.length; i++) {
    let typeString = typeTrim(argsArr[i].type.toString());
    if(scalarTypes.includes(typeString)) returnObj[argsArr[i].name] = '';
    else {
      returnObj[argsArr[i].name] = grabFields(typeString, schema.getType(typeString).getFields());
    };
  };
  return returnObj;
};

// console.log('createPost args (multi): ', grabArgs(mutationSchema.createPost.args));
// console.log('deleteUser args (single): ', grabArgs(mutationSchema.deleteUser.args));
// console.log('createUser args (nested): ', grabArgs(mutationSchema.createUser.args));

// console.log('createPost args string: ', buildString(grabArgs(mutationSchema.createPost.args)));
// console.log('deleteUser args string: ', buildString(grabArgs(mutationSchema.deleteUser.args)));
// console.log('createUser args string: ', buildString(grabArgs(mutationSchema.createUser.args)));

function argsStrFormatter(str) {
let strArray = str.split(' ');
const insIndex = strArray.indexOf('{');
if(insIndex > 0) {
  for(let i = insIndex + 1; i < strArray.length - 1; i++) {
    strArray[i] = `${strArray[i]}:$${strArray[i]},`
  };
  strArray.splice(insIndex, 0, ':');
}
else {
  for(let i = 0; i < strArray.length; i++) {
    strArray[i] = `${strArray[i]}:$${strArray[i]},`
  }
}

return strArray.join(' ');
};

// console.log(argsStrFormatter(buildString(grabArgs(mutationSchema.deleteUser.args))));
// console.log(argsStrFormatter(buildString(grabArgs(mutationSchema.createPost.args))));
// console.log(argsStrFormatter(buildString(grabArgs(mutationSchema.createUser.args))));

/********************************** 
***** QUERY GENERATOR FUNCTION ****
***********************************/

function generateQuery(operation) {
  // first figure out whether it is a query or mutation
  // will need to print the operation type in final output
  let operationType;
  let typeSchema;
  const querySchema = schema.getQueryType().getFields();
  const mutationSchema = schema.getMutationType().getFields();
  if(Object.keys(querySchema).includes(operation)) {
    operationType = 'Query';
    typeSchema = querySchema;
  };
  if(Object.keys(mutationSchema).includes(operation)) {
    operationType = 'Mutation';
    typeSchema = mutationSchema;
  };
  // console.log('operationType', operationType);

  // now look for all of the fields that need to be specified for the operation
  let returnFields = {};
  let operationFields = typeSchema[operation];
  let customTypeFields;

  // check to see if the type is a scalar type -> if not, then need to look up the fields for each type
  // NOTE: operationFields.type (e.g., User!) is type Object, not String
  const operationFieldsTypeTrim = typeTrim(operationFields.type.toString());

  if(scalarTypes.includes(operationFieldsTypeTrim)) returnFields[operationFieldsTypeTrim] = '';
  else {
    customType = operationFields.type;
    customTypeFields = schema.getType(typeTrim(operationFields.type.toString())).getFields()
    // use the grabFields helper function to recurse through each fields schema until we have all scalar fields for a type
    returnFields = grabFields(customType, customTypeFields);
  }
  // invoke buildString to create the string form of the query field
  const queryString = buildString(returnFields);

  // invoke grabArgs + buildString if the type.args object is not empty
  let argsString;
  if(operationFields.args.length) {
    argsString = `( ${argsStrFormatter(buildString(grabArgs(operationFields.args)))} )`;
  } else argsString = '';

  // the final query string is composed of the operation type + name of operation (args) + fields
  const returnString = `${operationType.toLowerCase()} { ${operation} ${argsString} { ${queryString} } }`
  return returnString;

}

// console.log('me: ', generateQuery('me'));
// console.log('createPost: ', generateQuery('createPost'));
// console.log('createUser: ', generateQuery('createUser'));
// console.log('deleteUser: ', generateQuery('deleteUser'));

// dummyLLC test
console.log('books:  ', generateQuery('books'));




/********************************** 
***** OBJ OUTPUT FUNCTION *********
***********************************/

function queryObject(manifest) {
  const endPoints = manifest.endpoints;
  // console.log('endPoints', endPoints);
  let returnObj = {};
  for(const path in endPoints) {
    for(const action in endPoints[path]) {
      // console.log('endPoints[path]', endPoints[path]);
      // console.log('endPoints[path][action]', endPoints[path][action]);
      const operationName = endPoints[path][action].operation
      returnObj[operationName] = generateQuery(operationName);
    };
  };
  return returnObj;
}

// console.log(queryObject(manifest));


