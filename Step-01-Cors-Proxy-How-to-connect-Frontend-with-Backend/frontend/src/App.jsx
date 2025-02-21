import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
function App() {
const [jokes, setJokes] = useState([]);

useEffect(()=>{
  axios.get("/api/jokes").then(function(response){
    setJokes(response.data);
  })
  .catch((err) => {
    console.log(err.message);
  })
});

  return (
    <>
      <div>
        <h2>Jokes: {jokes.length}</h2>

        {
          jokes.map(function(joke, index){
            return <div key={joke.id}>
              <p>Title: {joke.title}</p>
              <p>Content: {joke.content}</p>
            </div>
          })
        }
      </div>
    </>
  )
}

export default App
