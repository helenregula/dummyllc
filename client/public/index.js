/* EXAMPLE OF THE GRAPHQL REQUEST THAT WOULD GO STRAIGHT TO THE GRAPHQL SERVER */
// fetch('http://localhost:3000/graphql', {
//   method: 'post',
//   headers: { 'Content-Type': 'application/json' },
//   body:JSON.stringify({query: `query {
//         books{
//           results{
//             id
//             name
//           }
//         }
//       }`
//       }),
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))


/* REST API REQUEST TO GET SINGULAR BOOK FROM DB */
// fetch('http://localhost:3000/api/book/60a1a38fa2a2b037f6405887', {
//   method: 'get',
//   headers: { 'Content-Type': 'application/json' },
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))


/* REST API GET REQUEST TO GET SINGULAR AUTHOR */
// fetch('http://localhost:3000/api/author?id=609e85317d6b6b11b2e9813c', {
//   method: 'get',
//   headers: { 'Content-Type': 'application/json' },
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))


/* REST API REQUEST TO UPDATE BOOK, MAKE SURE TO CHANGE NAME IN THE REQUEST BODY */
// fetch('http://localhost:3000/api/book/60a1a34ca2a2b037f6405886', {
//   method: 'post',
//   headers: { 'Content-Type': 'application/json' },
//   body:JSON.stringify({book:{
//     name: "The Trials and Tribulations of Ms. Cookie Parser"
//   }}),
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))


/* REST API REQUEST TO GET ALL THE BOOKS IN THE DB */
// fetch('http://localhost:3000/api/books', {
//   method: 'get',
//   headers: { 'Content-Type': 'application/json' },
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))