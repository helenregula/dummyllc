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


fetch('http://localhost:3000/graphql', {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body:JSON.stringify({query}),
 }
).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))