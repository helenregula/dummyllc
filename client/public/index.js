const query = `
query {
    authors(params: { page: 1, pageSize: 2 }) {
      info {
        count
        next
        prev
        pages
      }
      results {
        id
      }
    }
    books(params: { page: 2, pageSize: 4 }) {
      info {
        count
        next
        prev
        pages
      }
      results {
        id
      }
    }
    publishers(params: { page: 1, pageSize: 1 }) {
      info {
        count
        next
        prev
        pages
      }
      results {
        id
      }
    }
  }
`;


// fetch('http://localhost:3000/graphql', {
//   method: 'post',
//   headers: { 'Content-Type': 'application/json' },
//   body:JSON.stringify({query}),
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))

// fetch('http://localhost:3000/api/author?id=609e85317d6b6b11b2e9813c', {
//   method: 'get',
//   headers: { 'Content-Type': 'application/json' },
//   //body:JSON.stringify({query}),
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))

fetch('http://localhost:3000/api/book/60a1a34ca2a2b037f6405886', {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body:JSON.stringify({book:{
    name: "The Trials and Tribulations of Ms. Cookie Parser"
  }}),
 }
).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))