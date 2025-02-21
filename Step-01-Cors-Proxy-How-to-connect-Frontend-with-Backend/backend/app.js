import express from 'express';
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", function(request, response){
    response.send("Running")
});

app.get("/api/jokes", function(request, response){
    const jokes = [
        {
            id: 1,
            title: "Math Joke",
            content: "Why was the equal sign so humble? Because it knew it wasn't less than or greater than anyone else."
        },
        {
            id: 2,
            title: "Computer Joke",
            content: "Why don't programmers like nature? It has too many bugs."
        },
        {
            id: 3,
            title: "Punny Joke",
            content: "I told my wife she was drawing her eyebrows too high. She looked surprised."
        },
        {
            id: 4,
            title: "Animal Joke",
            content: "Why don't skeletons fight each other? They don't have the guts."
        },
        {
            id: 5,
            title: "Food Joke",
            content: "Why did the scarecrow win an award? Because he was outstanding in his field!"
        }
    ];
    
    response.send(jokes);
    
})

const port = process.env.port || 5000;

app.listen(port, function(){
    // console.log(`serve at http://localhost:${port}`);
    console.log("running");
});