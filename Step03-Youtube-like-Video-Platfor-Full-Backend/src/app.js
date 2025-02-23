import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}

app.use(cors(corsOptions));

app.use(express.json({limit: "16kb"}));
/*  --> express.json() → Helps Express understand JSON data
    --> When a client (like a frontend app or Postman) sends data to your backend, the data is often sent in JSON format 
        or form-data format. However, by default, Express doesn’t understand this data. That’s why we need middleware to 
        convert it into a format that our backend can easily read.
    
    --> This middleware helps your backend understand JSON data.
        It takes the raw JSON data from the request body and converts it into a JavaScript object that you can access using req.body.

        
    --> Example:
        --> Without express.json()
            Your backend receives raw JSON: "{ \"name\": \"John\", \"age\": 25 }"
            But you can't use req.body.name because the backend doesn’t know how to read it.

        --> With express.json()
            Now, Express converts it into a JavaScript object: { name: "John", age: 25 }
            Now you can easily access it:
            console.log(req.body.name); // OUTPUT: "John"

    --> Why do we set limit: "16kb"?
        1. Security 🔒 → Prevents users from sending huge amounts of data that could crash your server. It also helps 
                        protect your server from potential denial-of-service (DoS) attacks where an attacker might send 
                        an extremely large data. It ensures your server doesn’t waste memory processing unnecessary large requests.
        2. Performance ⚡ → Ensures your server doesn’t waste time processing unnecessary large requests.
        
        --> 💡 Think of it like a restaurant menu:
            If a restaurant only allows orders under 16 items, it prevents people from ordering 1,000 dishes and overwhelming the kitchen.
            The same applies here—limiting the request size keeps your backend safe and fast. 🚀            
*/

app.use(express.urlencoded({extended: true, limit: "16kb"}));
/*  --> express.urlencoded() → Helps "Express" understand form data
    --> This middleware helps your backend understand form submissions (like when you submit a form on a website, like login or signup form).
        It converts URL-encoded data (like name=John&age=25) into a JavaScript object.
    --> Example:
        --> How Does It Work?

            When a user submits a form like this below:
            <form action="/submit" method="POST">
                <input type="text" name="username" value="John Doe" />
                <input type="email" name="email" value="john@example.com" />
                <button type="submit">Submit</button>
            </form>

        --> The browser sends the data in application/x-www-form-urlencoded format below:
            username=John+Doe&email=john%40example.com --> (Without express.urlencoded(), Express can’t understand this data.)
        
        -->  With express.urlencoded(), Express converts it into:
            {
                username: "John Doe",
                email: "john@example.com"
            }
            Now, we can access it using:
            console.log(req.body.username); // "John Doe"
            console.log(req.body.email); // "john@example.com"        

        --> Why Do We Use { extended: true }? 
            app.use(express.urlencoded({ extended: true }));
            
            Answer:-> true → Allows nested objects ({ user: { name: "John" } }).
                    false → Only allows simple key-value pairs.

*/

app.use(express.static("public"));
/*
    --> express.static("public") → Serves Static Files
        This tells Express to serve static files (like images, CSS, JavaScript) from the public folder.

    --> Example:-
        If you have a file logo.png inside public, and someone visits:
        http://localhost:3000/logo.png
        👉 Express will automatically serve the file!
*/

app.use(cookieParser());
/*
    --> cookie-parser is a middleware that extracts cookies from the request headers and makes them available in req.cookies.

    Why Do We Need It?
    Without cookie-parser → Express doesn’t automatically understand cookies.
    With cookie-parser → Express can easily access cookies from req.cookies.

*/

//Importing Routes
import userRouter from "./routes/user.routes.js" 


//routes declaration
app.use("/api/v1/user", userRouter)

export { app }