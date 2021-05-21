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

window.onload = function() {
  document.getElementById('2').onclick = async () => {
    const response = await fetch('http://localhost:3000/api/book/60a1a34ca2a2b037f6405886', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    })
    // console.log('Button 2')
    const parsedResponse = await response.json()
    // console.log("response", parsedResponse)
    document.getElementById("textbox").innerText = ""
    for(key in parsedResponse.data.book){
      // console.log(key)
      document.getElementById("textbox").innerText += ` ${key}: ${parsedResponse.data.book[key]} \n`;
    }
  }
  
  document.getElementById('1').onclick = async () => {
    const response = await fetch('http://localhost:3000/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({query: `query {
              book(id: "60a1a38fa2a2b037f6405887") {
                id
                name
              }
            }`
            }),
       });
    // console.log('Button 1')
    const parsedResponse = await response.json()
    // console.log("response", parsedResponse)
    document.getElementById("textbox").innerText = ""
    for(key in parsedResponse.data.book){
      // console.log(key)
      document.getElementById("textbox").innerText += ` ${key}: ${parsedResponse.data.book[key]} \n`;
    }
 }


  document.getElementById('4').onclick = async () => {
    const newName = document.getElementById("inputFieldREST").value;
    const response = await fetch('http://localhost:3000/api/book/60a1a34ca2a2b037f6405886', {
     method: 'post',
     headers: { 'Content-Type': 'application/json' },
     body:JSON.stringify({name: `${newName}`}),
   })
   const parsedResponse = await response.json()
  //  console.log("button4", parsedResponse)
   document.getElementById("textbox").innerText = ""
   for(key in parsedResponse.data.updateBook){
    // console.log(key)
    document.getElementById("textbox").innerText += `${key}: ${parsedResponse.data.updateBook[key]} \n`;
  }
 }
 
 document.getElementById('3').onclick = async () => {
  const newName = document.getElementById("inputFieldGQL").value;
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({query: `mutation {
          updateBook(id: "60a1a38fa2a2b037f6405887", book: { name: "${newName}"} ) {
            id
            name
          }
        }`
        }),
   });
   const parsedResponse = await response.json()
  //  console.log("button3", parsedResponse)
   document.getElementById("textbox").innerText = ""
   for(key in parsedResponse.data.updateBook){
    // console.log(key)
    document.getElementById("textbox").innerText += `${key}: ${parsedResponse.data.updateBook[key]} \n`;
  }
}
}


// document.getElementById('4').onclick = async () => {
//   const response = await fetch('http://localhost:3000/api/books', {
//    method: 'post',
//    headers: { 'Content-Type': 'application/json' },
//    body: JSON.stringify({ pageSize: 20, page:1 })
//  })
//  const parsedResponse = await response.json()
//  console.log("button4", parsedResponse)
//  document.getElementById("textbox").innerText = ""
//  for(key in parsedResponse.data.books.results){
//   console.log(key)
//   document.getElementById("textbox").innerText += `${key}: ${parsedResponse.data.book}\n`;
// }
// }
// }



// fetch('http://localhost:3000/api/book/60a1a38fa2a2b037f6405887', {
//   method: 'get',
//   headers: { 'Content-Type': 'application/json' },
// }
// ).then(res => res.json()).then(data => { console.log(data) }).catch(err => console.log(err))


/* REST API GET REQUEST TO GET SINGULAR AUTHOR */
// fetch('http://localhost:3000/api/author?id=609e85317d6b6b11b2e9813c', {
//   method: 'get',
//   headers: { 'Content-Type': 'application/json' },
// }
// ).then(res => res.json()).then(data => { console.log(data) }).catch(err => console.log(err))


// /* REST API REQUEST TO UPDATE BOOK, MAKE SURE TO CHANGE NAME IN THE REQUEST BODY */
// fetch('http://localhost:3000/api/book/60a1a34ca2a2b037f6405886', {
//   method: 'post',
//   headers: { 'Content-Type': 'application/json' },
//   body:JSON.stringify({name: "The Trials and Tribulations of Ms. Cookie Parser"}),
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))


// /* REST API REQUEST TO GET ALL THE BOOKS IN THE DB */
// fetch('http://localhost:3000/api/books', {
//   method: 'get',
//   headers: { 'Content-Type': 'application/json' },
//  }
// ).then(res => res.json()).then(data=>{console.log(data)}).catch(err => console.log(err))


